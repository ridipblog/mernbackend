const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const env=require('dotenv');
env.config({path:'./config.env'})
const cookieParser=require('cookie-parser');
router.use(cookieParser())
require('../db/conn');
const Users = require('../model/users');
const authenticate=require('../middleware/authenticate');
router.post('/register', async (req, res) => {
    let { name, email, phone, work, password} = req.body;

    if (!name || !email || !phone) {
        return res.status(422).json({ message: "Fill All Inputs " })
    }
    const findUser = await Users.findOne({ email: email });
    if (findUser) {
        return res.status(422).json({ message: "Email Already Exists " });
    }
    await bcrypt.hash(password, 12).then(hash => {
            password=hash
        });
    const data = await new Users({
        _id: new mongoose.Types.ObjectId,
        name: name,
        email: email,
        phone: phone,
        work: work,
        password: password,
    })
    await data.save().then((store) => {
        res.status(201).json(store);
    });
});
router.post('/singin', async (req, res) => {
    console.log("Ok");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ mess: "Fill Inputs" })
    }
    const findUser = await Users.findOne({ email: email });
    if (!findUser) {
        return res.status(422).json({ mess: "Email ID Not Found " });
    }
    let check;
    await bcrypt.compare(password,findUser.password).then(result=>{
        check=result;
    })
    if (check===false) {
        return res.status(422).json({ mess: "Invalid Creditials" })
    }
    console.log("addming cookie");
    await res.cookie("email",findUser.email);
    await res.status(201).json(findUser);
});
router.post('/delete', async (req, res) => {
    const email=req.query.email;
    await Users.deleteOne({ email });
    res.status(201).json({ mess: "Email Removed" });
})
router.get('/home',(req,res)=>{
    console.log("Done");
    const findUser=await Users.findOne({email:req.cookies.email});
    res.status(201).json(findUser);
})
router.get('/about',authenticate,(req,res)=>{
    res.send(req.userData);
})
router.get('/contact',authenticate,(req,res)=>{
    res.send(req.userData);
})
router.post("/sendContact",async(req,res)=>{
    let {name,email,subject,message}=req.body;
    if(!name || !email || !subject || !message){
        return res.status(422).json({mess:"Fill All Inputs "})
    }
    const result = await Users.updateOne(
        { email: email },
        { $push: { message: message } }
    ).then((store)=>{
        res.status(201).json(store)
    });
})
router.get('/logout',(req,res)=>{
    if(req.cookies.email){
        res.clearCookie("email");
        res.status(201).json({mess:"Done"})
    }
    else{
        res.status(422).json({mess:"Not Done"})
    }
})
module.exports = router;

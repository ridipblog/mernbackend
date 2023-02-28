const Users=require('../model/users');
const authenticate=async(req,res,next)=>{
    try{
        const email=req.cookies.email;
        const userData=await Users.findOne({email:email});
        if(!userData){
            throw new Error("User Not Found ");
        }
        req.userData=userData;
        next();
    }
    catch(err){
        res.status(401).send("Unauthorized Token");
        console.log(err);
    }
}
module.exports=authenticate;
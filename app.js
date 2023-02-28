const express=require('express');
const app=express();
const mongoose=require('mongoose');
const env=require('dotenv');
env.config({path:'./config.env'})
app.use(express.json());
app.use(require('./router/auth'));
const port=process.env.PORT || 3000;
app.listen(port);

const express=require('express')
const cors=require('cors')
const app=express();
const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)

.then(()=>{
    console.log('mongodb connected successfully')
})
.catch("mongodb connection failed")

const authRoutes = require('./routes/authRoutes');
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port no ${process.env.PORT}`)
})
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


const app = express();

app.use(express.static("images"));

const URI = "mongodb+srv://Dinesh:tSb2ySwnWq4lBJi9@cluster0.osbra.mongodb.net/techno-tackle_E-commerce?retryWrites=true&w=majority";
mongoose.connect(URI,{useNewUrlParser:true,useUnifiedTopology: true })
.then((res)=>{ 
    console.log("the express is listening in the port 4000:");
    app.listen(4000,()=>{
    console.log("Database is  connected sucessfully");
    });
})
.catch((err)=>console.log("database is not connected to  the network"));


app.set('view engine','ejs');


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'))

const User = require('./router/userRoute');
app.use('/user', User);

// if the url nothing finds 
app.use((req,res)=>{
    res.render('404');
});
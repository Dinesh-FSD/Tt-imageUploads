const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    User_name:{
        type : String,
        required : true
    }, 
    avatar:[],

},{timestamps : true});


const Users = mongoose.model('userImage4',userSchema);
module.exports = Users;
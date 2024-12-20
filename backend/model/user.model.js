const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true,unique:true},
    password:{type:String, require:true,select:false},
    upi_id:{type:String,require:true},
    balance:{type:Number}
   
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({id:this._id}, process.env.JWT_SECRET,{})
    
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10)
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel; 

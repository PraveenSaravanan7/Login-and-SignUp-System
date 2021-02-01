const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    }
}, {
    timestamps: true
});

var Users = mongoose.model('Users',usersSchema,'users');

module.exports = Users;
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var authJWT=require('./auth');
const accessTokenSecret = 'youraccesstokensecret';
const bodyParser = require('body-parser');
const Users=require('../models/users');
const bcrypt = require('bcrypt')

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  console.log(hash)
  return(hash)
}
async function hashPasswordCompare(password,hash) {
  const isSame = await bcrypt.compare(password, hash) // updated
  console.log(isSame)
  return(isSame)
}

router.route('/')
.get(authJWT,(req,res,next) => {
  if(req.user.admin){
    Users.find()
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
  else{
    res.sendStatus(401);
  }
})
.post((req,res,next) =>{
  hashPassword(req.body.password)
  .then((h)=>{
    req.body.admin=false
    req.body.password=h 
  Users.create(req.body)
  .then((users) => {
    res.statusCode = 200;
    const accessToken = jwt.sign({ userid:users._id, admin:users.admin }, accessTokenSecret);
    res.setHeader('Content-Type', 'application/json');
    res.json({
      accessToken,user_id:users._id,admin:users.admin
  });
}, (err) => {var err = new Error(err);
err.status = 403;next(err)} )
.catch((err) => next(err));
  })
});

router.route('/:id')
.get((req,res,next) => {
  const uid= req.params.id;
  Users.findOne({_id:uid},{password:0})
  .then((user) =>{
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  },(err) => next(res.json({})))
.catch((err) => next(err));
})
.put(authJWT,(req,res,next) => {
  if(req.user.admin){
  Users.updateOne({_id:req.user.userid},req.body)
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
}, (err) => next(err))
.catch((err) => next(err));
  }
  else{
    res.sendStatus(401);
  }

});


router.route('/login')
.post((req,res,next) =>{
    let { email, password } = req.body;
   
    Users.findOne({email: email})
    .then((user) => {
      if (user === null) {
        var err = new Error(email + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      hashPasswordCompare(req.body.password,user.password)
      .then((c)=>{
        if(c){
          res.statusCode = 200;
          const accessToken = jwt.sign({ userid:user._id, admin:user.admin }, accessTokenSecret);
  
          res.json({
              accessToken,user_id:user._id,admin:user.admin
          });
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
        else{
          var err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
      })  
     
    })
    .catch((err) => next(err));
    
});


module.exports = router;

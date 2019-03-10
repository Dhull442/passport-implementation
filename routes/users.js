const express = require('express'),
      bcrypt = require('bcryptjs'),
      passport = require('passport');
const router = express.Router();

// User Model
const User = require('../models/user');

// Login
// Page
router.get('/login',(req,res)=> res.render('login'));

// Form
router.post('/login',(req,res,next)=> {
  // console.log(req.body);
  const { email, password } = req.body;
  let errors = [];

  // Check required fields:
  if(!email || !password ){
    errors.push({msg: 'Please fill all the fields'});
  }
  else{
    if(password.length < 6){
      errors.push({msg: 'Incorrect password'});
    }
  }
  if(errors.length > 0){
    res.render('login',{
      errors,
      email,
      password
    });
  }
  else{
    // type pass checks done
    passport.authenticate('local',{
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash : true
    })(req,res,next);
  }
});

// Logout Handle
router.get('/logout',(req,res)=> {
  req.logout();
  req.flash('success_reg','You are logged out');
  res.redirect('/');
})
// Register
// Page
router.get('/register',(req,res)=> res.render('register'));

// Form
router.post('/register',(req,res)=> {
  // console.log(req.body);
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if(!name || !email || !password || !password2 ){
    errors.push({ msg: 'Please fill in all the fields'});
  }
  else
  {
    if(password.length < 6){
      errors.push({msg: 'Password should be at least 6 char long.'});
    }
    else if((password !== password2)){
      errors.push({msg: 'Passwords don\'t match'});
    }
  }
  if(errors.length > 0){
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    })
    console.log(errors);
  }
  else{
    // Validation Passes:
    // console.log('Validation passes');
    User.findOne({ email: email })
      .then(user => {
      if(user){
        // User already exists
        errors.push({msg: 'This Email is already in use'})
        res.render('register',{
          errors,
          name,
          email,
          password,
          password2
        });
        console.log(errors);
      }
      else{
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash password
        bcrypt.genSalt(10,(err,hashtable)=>{
          bcrypt.hash(newUser.password,hashtable,(err,hash)=>{
            if(err) throw err;
            // Set hashed password
            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_reg','You are registered successfully');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          })})
        console.log(newUser)
        };
    });
  };
});

module.exports = router;

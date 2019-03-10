const express = require('express'),
      { ensureAuth } = require('../config/auth');
const router = express.Router();

// Welcome Page
router.get('/',(req,res)=> res.render('welcome'));

// Dashboard page
router.get('/dashboard',ensureAuth, (req,res)=> res.render('dashboard',{
  user: req.user
}));

module.exports = router;

const express = require('express'),
      expressLayouts = require('express-ejs-layouts'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      session = require('express-session'),
      passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Passport Config
require('./config/passport')(passport);

//DB Config
const dbURI = 'mongodb://dhull442:asdf@market-shard-00-00-l4mhq.mongodb.net:27017,market-shard-00-01-l4mhq.mongodb.net:27017,market-shard-00-02-l4mhq.mongodb.net:27017/test?ssl=true&replicaSet=market-shard-0&authSource=admin&retryWrites=true';
//require('./config/keys').mongoURI;

// Connect to mongo
mongoose.connect(dbURI,{ useNewUrlParser: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body useNewUrlParser
app.use(express.urlencoded({extended: false}));

// Express Session Middleware
app.use(session({
  secret: 'registration confirmation',
  resave: true,
  saveUninitialized: true
  // cookie: { secure: true }
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variable
app.use((req,res,next)=>{
  res.locals.success_reg = req.flash('success_reg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.error       = req.flash('error');
  next();
})
// ROUTES
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.listen(PORT, console.log(`Server started on ${PORT}`));

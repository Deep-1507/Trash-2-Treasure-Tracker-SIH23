const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'Deep@su@30@1507',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect('mongodb://localhost:27017/registrationdata', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  address: String,
  city: String,
  district: String,
  pincode: Number,
  state: String,
  aadhar: Number,
  password: String, // Combine password1 and password2 into a single field
});

const User = mongoose.model('Users', userSchema);

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/userregister.html');
});

app.post('/submit', (req, res) => {
  const {
    name,
    phone,
    email,
    address,
    city,
    district,
    pincode,
    state,
    aadhar,
    password,
  } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('An error occurred');
    } else {
      const user = new User({
        name,
        phone,
        email,
        address,
        city,
        district,
        pincode,
        state,
        aadhar,
        password: hash,
      });

      user
        .save()
        .then(() => {
          res.send('Data submitted successfully!');
        })
        .catch((error) => {
          console.error('Error saving data:', error);
          res.status(500).send('An error occurred');
        });
    }
  });
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })
);

app.get('/dashboard', (req, res) => {
  // You can access user data here using req.user
  res.send('Welcome to the dashboard, ' + req.user.name);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

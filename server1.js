const express = require('express');
const mongoose = require('mongoose');

const app = express();
// require("./db/conn");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

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
  password1: String,
  password2: String, 
});

const User = mongoose.model('Users', userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/userregister.html');
 });

app.post('/submit', (req, res) => {
  const { name, phone, email,address,city,district,pincode,state,aadhar, password1, password2 } = req.body;
  const user = new User({ name, phone, email, address,city,district,pincode,state,aadhar,password1, password2 });

  user
    .save()
    .then(() => {
      res.send('Data submitted successfully!');
    })
    .catch((error) => {
      console.error('Error saving data:', error);
      res.status(500).send('An error occurred');
    });
});


// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle the login form submission
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user in the database
  User.findOne({ email: email, password1: password1 }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (!user) {
      res.status(401).send('Invalid email or password');
    } else {
      // Render the user's dashboard
      res.render('dashboard', { user: user });
    }
  });
});

// Serve the user's dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

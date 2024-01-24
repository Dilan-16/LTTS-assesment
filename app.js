const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/registration', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  activated: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Express Routes
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    // Create a new user
    const newUser = new User({ name, email, phone });
    await newUser.save();

    // Send verification email
    const activationLink = `http://localhost:${PORT}/activate/${newUser._id}`;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Activate your account',
      text: `Click on the following link to activate your account: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);
    
    res.send('Registration successful. Please check your email for activation link.');
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).send('Registration failed.');
  }
});

app.get('/activate/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (user.activated) {
      return res.send('User already activated.');
    }

    user.activated = true;
    await user.save();

    res.send('Account activated. You can now log in.');
  } catch (error) {
    console.error('Activation error:', error.message);
    res.status(500).send('Activation failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

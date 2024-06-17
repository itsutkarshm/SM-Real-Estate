const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

const app = express();
const prisma = new PrismaClient();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'app')));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// About Route
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'about' , 'index.html'));
});

// T&C route
app.get('/terms-and-conditions', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'terms-and-conditions' , 'index.html'));
});

// Oro Constella Route
app.get('/properties/oro-constella ', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'properties' , 'Oro-Constella' , 'index.html'));
});

// Rishita Mulberry
app.get('/properties/rishita-mulberry', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', "properties" , 'Rishita-Mulberry' , 'index.html'));
});

//Privacy Policy route
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'privacy-policy-2' , 'index.html'));
});

// Contact form route
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'contact', 'index.html'));
});

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    await prisma.submission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    console.log('done');
    res.redirect('/#toast=contact_success');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error inserting data');
  }
});

// Admin login route
app.get('/admin', (req, res) => {
  res.render('login', { message: req.flash('message') });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (foundUser) {
      const result = await bcrypt.compare(password, foundUser.password);
      if (result === true) {
        req.session.user = foundUser;
        res.redirect('/dashboard');
      } else {
        req.flash('message', 'Incorrect password');
        res.redirect('/admin');
      }
    } else {
      req.flash('message', 'No user found with that username');
      res.redirect('/admin');
    }
  } catch (err) {
    console.log(err);
  }
});

// Dashboard route
app.get('/dashboard', async (req, res) => {
  if (req.session.user) {
    try {
      const submissions = await prisma.submission.findMany();
      res.render('dashboard', { submissions });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin');
  }
});

// Register route (for admin)
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.redirect('/admin');
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
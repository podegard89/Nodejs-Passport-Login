const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const secrets = require('./secrets');
const Sheet = require('./sheet');

// Initialize new sheet
const sheet = new Sheet();

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  async (email) => {
    await sheet.load();
    return await sheet.getRowByEmail(email);
  },
  async (id) => {
    await sheet.load();
    return await sheet.getRowById(id);
  }
)

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: secrets.session_key,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkAuthenticated, (req, res) => {
  res.render('register.ejs');
})

app.post('/register', checkAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await sheet.load();
    await sheet.addRow({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
})

app.delete('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) { return next(err); };
  })
  res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.listen(secrets.port);
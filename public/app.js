const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const User = require('./models/User'); // Make sure to adjust the path according to your file structure

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true in production with HTTPS
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Route to serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Route to serve the data modification page
app.get('/update-data', async (req, res) => {
    if (!req.session.email) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'modify.html'));
});

// Handle login form submission
// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        req.session.email = email; // Store user's email in session
        console.log(`Login successful: Email: ${email}`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// Handle registration form submission
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(200).send('User registered successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Handle data update form submission
app.post('/update-data', upload.single('profilePicture'), async (req, res) => {
    const { username, password } = req.body;
    const profilePicture = req.file ? req.file.path : null;
    const email = req.session.email;

    try {
        const updatedData = { username, password };
        if (profilePicture) {
            updatedData.profilePicture = profilePicture;
        }
        await User.findOneAndUpdate({ email }, updatedData);
        res.status(200).send('User data updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Default redirection to the login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

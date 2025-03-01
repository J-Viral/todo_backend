const express = require('express');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// const JWT_SECRET = process.env.JWT_SECRET;

router.get('/', async (req, res) => {
    console.log("hello, I am live!")
    res.json("Hello, I am live!")
});

// Signup
router.post('/signup', async (req, res) => {
    try {
        // console.log("hiii in signup");
        const { email, password } = req.body;
        if(!email || !password) {
            console.log("Missing details");
        }
        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
          })
          
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.log("error : ", error);
        res.json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email);
    if (error || users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid email or password' });

    // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Logout (Handled on the client side)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Forgot Password (Mock endpoint)
router.post('/forget-password', async (req, res) => {
    const { email } = req.body;
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email);
    if (error || users.length === 0) return res.status(400).json({ error: 'User not found' });
    res.json({ message: 'Password reset link sent to email' });
});

module.exports = router;

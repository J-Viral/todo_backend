require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
// console.log("on line 12 in index.js")
// Routes
// app.use('/auth', authRoutes);
app.use('/task', taskRoutes);

app.get('/', async (req, res) => {
    console.log("hello, I am live!")
    res.json("Hello, I am live!")
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

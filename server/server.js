const express = require('express');
require('dotenv').config()
const connectDB = require('./config/db');
const cors = require('cors')

const authRoutes = require('./routes/user.routes');

const app = express();
app.use(cors())

connectDB();
app.use(express.json());

app.get('/',(req,res) => {
    res.send("A quick reminder for my you dear developer, you are a true problem solver!")
})

app.use('/api/auth' , authRoutes);


const PORT = process.env.PORT || 8001

app.listen(PORT,() => {
    console.log("Server is running now!", PORT)
})

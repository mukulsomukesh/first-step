const express = require('express');
require('dotenv').config()
const connectDB = require('./config/db');
const cors = require('cors')
const cron = require('node-cron'); // for scheduling tasks


const authRoutes = require('./routes/user.routes');
const notesRoutes = require('./routes/notes.routes');
const todoRoutes = require('./routes/todo.routes');
const { sendReminders } = require('./controllers/cornjob.controller');
const cornjobRoutes = require('./routes/cornjob.routes');


const app = express();
app.use(cors())

connectDB();
app.use(express.json());

app.get('/',(req,res) => {
    res.send("A quick reminder for my you dear developer, you are a true problem solver!")
})

app.use('/api/auth' , authRoutes);
app.use('/api/notes' , notesRoutes);
app.use('/api/cornjob' , cornjobRoutes);
app.use('/api/todo' , todoRoutes);


// Schedule the cron job to run every day at 10 AM
cron.schedule('0 10 * * *', () => {
    console.log('Running revision reminder cron job...');
    
    // Directly call the controller function instead of making an HTTP request
    sendReminders()
        .then(() => {
            console.log('Successfully triggered revision reminder');
        })
        .catch((error) => {
            console.error('Error triggering revision reminder', error);
        });
});


const PORT = process.env.PORT || 8001

app.listen(PORT,() => {
    console.log("Server is running now!", PORT)
})

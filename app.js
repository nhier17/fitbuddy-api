require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();

// rest of packages
const cors = require('cors');
const cookieParser = require('cookie-parser');

//db
const connectDB = require('./db/connect');

//routers
const authRouter = require('./routes/AuthRoutes'); 

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);

// routes
app.get('/', (req, res) => {
    res.send('API is running...');
})

const port = process.env.PORT || 5000;
const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (error) {
       console.error(error); 
    }
};

start();
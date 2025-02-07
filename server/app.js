const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('Content-Type', 'video/mp4');
    }
}));


app.use('/uploads', (req, res, next) => {
    console.log(`Serving file: ${req.url}`);
    next();
});


app.use('/users', userRoutes);
console.log('User routes initialized');

app.use('/videos', videoRoutes);
console.log('Video routes initialized');


app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

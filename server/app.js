

const express = require('express');
const bodyParser = require('body-parser');
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


app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.set('Content-Type', 'video/mp4');
    }
}));
// app.use(cors(corsOptions));

app.use('/uploads', (req, res, next) => {
    console.log(`Serving file: ${req.url}`);
    next();
}, express.static('uploads'));

app.use('/users', userRoutes);
console.log('User routes initialized');

app.use('/videos', videoRoutes);
console.log('Video routes initialized');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


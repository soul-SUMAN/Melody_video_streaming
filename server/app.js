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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "https://res.cloudinary.com");
    next();
});

app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//     setHeaders: (res, path) => {
//         if (path.endsWith('.mp4')) {
//             res.setHeader('Content-Type', 'video/mp4');
//         }
//     }
// }));


// app.use('/uploads', (req, res, next) => {
//     console.log(`Serving file: ${req.url}`);
//     next();
// });


app.use('/users', userRoutes);
console.log('User routes initialized');

app.use('/videos', videoRoutes);
console.log('Video routes initialized');


// Serve frontend but don't override API routes
// app.use((req, res, next) => {
//     if (req.path.startsWith('/uploads') || req.path.startsWith('/users') || req.path.startsWith('/videos')) {
//         return next();
//     }
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/users') || req.path.startsWith('/videos')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public/index.html'));
});




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

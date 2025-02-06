const express = require('express');
const multer = require('multer');
const Video = require('../models/Video');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Save uploaded videos in the 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Generate unique file name
    }
});

const upload = multer({ storage: storage });

// Upload Video
router.post('/upload', verifyAdmin, upload.single('video'), async (req, res) => {
    const { title, description } = req.body;
    console.log('Upload video request received:', { title });
    const videoPath = `/uploads/${req.file.filename}`;

    try {
        const video = new Video({ title, description, videoPath });
        await video.save();
        console.log('Video uploaded successfully:', title);
        res.status(201).send('Video uploaded successfully');
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(400).send('Error uploading video');
    }
});

// Fetch Videos
router.get('/all', async (req, res) => {
    console.log('Fetch videos request received');
    try {
        const videos = await Video.find();
        console.log('Videos fetched successfully:', videos.length);
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(400).send('Error fetching videos');
    }
});

// search video

router.get('/search', async (req, res) => {
    const { title } = req.query; // Extract the search query
    console.log(`Search request for title: ${title}`);
    try {
        const videos = await Video.find({ title: new RegExp(title, 'i') }); // Case-insensitive search
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).send('Error searching videos');
    }
});


router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    console.log('Delete request for video ID:', id); 

    try {
        const video = await Video.findByIdAndDelete(id);
        if (video) {
            console.log('Video deleted successfully:', video);
            res.status(200).send('Video deleted successfully');
        } else {
            console.warn('Video not found for ID:', id);
            res.status(404).send('Video not found');
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).send('Error deleting video');
    }
});
module.exports = router;

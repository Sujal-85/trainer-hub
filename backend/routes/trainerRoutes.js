import express from 'express';
import multer from 'multer';
import Trainer from '../models/Trainer.js';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure Multer for file handles (currently mocking storage)
const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const cpUpload = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]);

router.post('/register', cpUpload, async (req, res) => {
    try {
        const trainerData = JSON.parse(req.body.data);
        const type = req.body.type;

        const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
        const photoFile = req.files['profilePhoto'] ? req.files['profilePhoto'][0] : null;

        let resumeUrl = null;
        let profilePhotoUrl = null;

        // Upload to Supabase
        if (resumeFile) {
            const fileName = `resumes/${uuidv4()}-${resumeFile.originalname}`;
            const { data, error } = await supabase.storage
                .from('trainers')
                .upload(fileName, resumeFile.buffer, {
                    contentType: resumeFile.mimetype,
                    upsert: true
                });

            if (error) throw error;
            const { data: publicUrlData } = supabase.storage.from('trainers').getPublicUrl(fileName);
            resumeUrl = publicUrlData.publicUrl;
        }

        if (photoFile) {
            const fileName = `photos/${uuidv4()}-${photoFile.originalname}`;
            const { data, error } = await supabase.storage
                .from('trainers')
                .upload(fileName, photoFile.buffer, {
                    contentType: photoFile.mimetype,
                    upsert: true
                });

            if (error) throw error;
            const { data: publicUrlData } = supabase.storage.from('trainers').getPublicUrl(fileName);
            profilePhotoUrl = publicUrlData.publicUrl;
        }

        const newTrainer = new Trainer({
            ...trainerData,
            type,
            resumeUrl,
            profilePhotoUrl
        });

        await newTrainer.save();

        res.status(201).json({
            success: true,
            message: 'Trainer profile created successfully',
            data: newTrainer
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create trainer profile',
            error: error.message
        });
    }
});

// Get all trainers (Admin only)
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find().sort({ createdAt: -1 });
        res.json({ success: true, data: trainers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch trainers', error: error.message });
    }
});

// Update trainer status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const trainer = await Trainer.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, data: trainer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
    }
});

export default router;

import express from 'express';
import multer from 'multer';
import { parseResumeText } from '../services/aiService.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post('/parse-resume', upload.single('resume'), async (req, res) => {
    console.log('AI Parse Request Received - Timestamp:', new Date().toISOString());
    try {
        if (!req.file) {
            console.warn('AI Parse Error: No file uploaded');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        console.log('File details - Name:', req.file.originalname, 'Size:', req.file.size, 'Mime:', req.file.mimetype);

        const extractedData = await parseResumeText(req.file.buffer);

        res.json({
            success: true,
            data: extractedData
        });
    } catch (error) {
        console.error('AI Parsing Route Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to parse resume with AI',
            error: error.message
        });
    }
});

export default router;

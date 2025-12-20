import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to ensure the bucket exists
export const ensureBucketExists = async (bucketName) => {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    const bucketExists = buckets.find(b => b.name === bucketName);

    if (!bucketExists) {
        console.log(`Bucket "${bucketName}" not found. Attempting to create...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
            console.error(`Failed to create bucket "${bucketName}":`, createError.message);
            console.warn(`Please create a public bucket named "${bucketName}" manually in the Supabase dashboard.`);
        } else {
            console.log(`Bucket "${bucketName}" created successfully.`);
        }
    }
};

// Initialize bucket check
ensureBucketExists('trainers');

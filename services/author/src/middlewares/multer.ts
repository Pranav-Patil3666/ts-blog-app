import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory or cloud not locally

const uploadFile = multer({storage}).single("file"); // Expecting a single file with the field name "file"

export default uploadFile;
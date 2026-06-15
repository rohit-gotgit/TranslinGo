import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

const fileFilter = (req, file, cb) => {
    // Check file type
    if (!ALLOWED_FILE_TYPES[file.mimetype]) {
        return cb(new ApiError(400, `File type ${file.mimetype} is not allowed. Allowed types: images (jpg, png, gif, webp) and documents (pdf, doc, docx)`));
    }

    // Check file extension
    const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES[file.mimetype].includes(fileExtension)) {
        return cb(new ApiError(400, `File extension ${fileExtension} does not match the file type`));
    }

    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        // Sanitize filename
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueSuffix + "-" + sanitizedName);
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only allow 1 file at a time
    },
    fileFilter: fileFilter
});
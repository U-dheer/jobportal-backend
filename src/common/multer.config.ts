import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
            return cb(new Error('Only PDF and DOC files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
};
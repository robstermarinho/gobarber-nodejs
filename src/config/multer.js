import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// Create disk storage
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // cb callback fo filename

      // Generate a random name to the filename
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // First parameter is the error
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

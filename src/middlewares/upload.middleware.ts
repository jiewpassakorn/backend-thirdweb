import multer from 'multer';

export interface File {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

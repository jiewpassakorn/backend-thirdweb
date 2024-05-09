import { NextFunction, Request, Response } from 'express';
import { UploadService } from '../services/upload.service';
import { File } from '../middlewares/upload.middleware';

class UploadController {
  private uploadService: UploadService;
  constructor() {
    this.uploadService = new UploadService();
  }
  upload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = req.file as File;
      if (!req.file) {
        const error = new Error('No file uploaded');
        (error as any).status = 400;
        throw error;
      }
      const result = await this.uploadService.uploadFile(file);

      res.status(200).send(result);
    } catch (error: any) {
      console.log(error);

      next(error);
    }
  };

  viewFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { filename } = req.params;
      const result = await this.uploadService.viewFile(filename);
      const buffer = Buffer.from(result.data, 'binary');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length
      });
      res.end(buffer);
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };

  deleteFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { filename } = req.params;
      const result = await this.uploadService.deleteFile(filename);
      res.status(200).send(result);
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };
}
export { UploadController };

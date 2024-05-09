import { NextFunction, Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { UploadService } from '../services/upload.service';
import { File } from '../middlewares/upload.middleware';

class StudentController {
  private studentService: StudentService;
  private uploadService: UploadService;
  constructor() {
    this.studentService = new StudentService();
    this.uploadService = new UploadService();
  }
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const student = req.body;
      const result = await this.studentService.create(student);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const student = req.body;
      const result = await this.studentService.update(student);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.body;
      const result = await this.studentService.delete(id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  uploadProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = req.file as File;
      const studentId = req.params.studentId;
      const uploadResult = await this.uploadService.uploadFile(file);
      if (!uploadResult) {
        const error = new Error('File upload failed');
        (error as any).status = 500;
        throw error;
      }
      const student =
        await this.studentService.getStudentByStudentId(studentId);
      if (!student) {
        throw new Error('User not found');
      }
      student.image = uploadResult.fileURL;
      const updatedStudent = await this.studentService.update(student);
      res.status(200).send(updatedStudent);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  viewProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const studentId = req.params.studentId;
      const student =
        await this.studentService.getStudentByStudentId(studentId);
      if (!student) {
        throw new Error('User not found');
      }
      const filename = student.image;

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

  getStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { studentId } = req.body;
      const student =
        await this.studentService.getStudentByStudentId(studentId);
      res.status(200).send(student);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export { StudentController };

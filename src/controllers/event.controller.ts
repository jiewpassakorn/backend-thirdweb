import { NextFunction, Request, Response } from 'express';
import { NFTService } from '../services/nft.service';
import { Contract, contractAddress } from '../utils/contracts';
import { WalletService } from '../services/wallet.service';
import { EventService } from '../services/event.service';
import { File } from '../middlewares/upload.middleware';
import { UploadService } from '../services/upload.service';
import { StudentService } from '../services/student.service';

class EventController {
  private nftService: NFTService;
  private contract: Contract;
  private walletService: WalletService;
  private eventService: EventService;
  private uploadService: UploadService;
  private studentService: StudentService;

  constructor() {
    this.nftService = new NFTService();
    this.walletService = new WalletService();
    this.contract = new Contract();
    this.eventService = new EventService();
    this.uploadService = new UploadService();
    this.studentService = new StudentService();
  }
  registerForEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId } = req.body;
      const studentId = req.user?.username as string;
      const student =
        await this.studentService.getStudentByStudentId(studentId);
      const tx = await this.eventService.registerForEvent(eventId, student);
      res.status(200).send({ tx });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  joinEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId } = req.body;
      const studentId = req.user?.username as string;
      const student =
        await this.studentService.getStudentByStudentId(studentId);
      const tx = await this.eventService.joinEvent(eventId, student);
      res.status(200).send({ tx });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  closeEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId } = req.body;
      const tx = await this.eventService.closeEvent(eventId);
      res.status(200).send({ tx });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const event = req.body;
      const tx = await this.eventService.create(event);
      res.status(200).send({ tx });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // EventController

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.eventService.getAll();
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.body;
      const result = await this.eventService.getById(id);
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
      const event = req.body;
      const result = await this.eventService.update(event);
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
      const result = await this.eventService.delete(id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  close = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.body;
      const tx = await this.eventService.close(id);
      res.status(200).send({ tx });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  uploadEventImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = req.file as File;
      const result = await this.uploadService.uploadEventImage(file);

      if (!result) {
        const error = new Error('File upload failed');
        (error as any).status = 500;
        throw error;
      }

      res.status(200).send(result);
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };
}

export { EventController };

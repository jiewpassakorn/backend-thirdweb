import { NextFunction, Request, Response } from 'express';
import { BadgeService } from '../services/badge.service';
import { IBadge } from '../models/badge.model';
import { WalletService } from '../services/wallet.service';
import { IMetadata } from '../models/nft.model';
import { StudentService } from '../services/student.service';
import { IStudent } from '../models/student.model';

class BadgeController {
  private badgeService: BadgeService;
  private walletService: WalletService;
  private studentService: StudentService;

  constructor() {
    this.badgeService = new BadgeService();
    this.walletService = new WalletService();
    this.studentService = new StudentService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const badge: IMetadata = req.body;
      const txHash = await this.badgeService.create(badge);
      res.status(200).send({ txHash });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.badgeService.getAll();
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
      const result = await this.badgeService.getById(id);
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
      const badge = req.body;
      const result = await this.badgeService.update(badge);
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
      const result = await this.badgeService.delete(id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  assignBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { studentId, badgeTokenId } = req.body;
      const student: IStudent =
        await this.studentService.getStudentByStudentId(studentId);
      const walletAddress = student.walletAddress;
      if (!walletAddress) {
        throw new Error('Wallet address not found');
      }
      const result = await this.badgeService.assignBadgeTo(
        walletAddress,
        badgeTokenId,
        1
      );
      res.status(200).send({ txHash: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  assignBadgeToMultiWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { studentIds, badgeTokenId } = req.body;
      const students: IStudent[] = [];
      for (const studentId of studentIds) {
        const student: IStudent =
          await this.studentService.getStudentByStudentId(studentId);
        students.push(student);
      }
      const walletAddresses = students.map((student) => student.walletAddress);
      if (!walletAddresses) {
        throw new Error('Wallet address not found');
      }
      console.log('walletAddresses', walletAddresses);
      const result = await this.badgeService.assignBadgeToMultiWallet(
        walletAddresses as string[],
        badgeTokenId
      );
      res.status(200).send({ txHash: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // assignBadgeLoggedUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { badgeTokenId } = req.body;
  //     const user = req.user;
  //     if (!user) {
  //       throw new Error('User not found');
  //     }
  //     const result = await this.badgeService.assignBadge(user, badgeTokenId);
  //     res.status(200).send(result);
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };

  // getDefaultBadge = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const user = req.user;

  //     if (!user) {
  //       throw new Error('User not found');
  //     }
  //     const result = await this.badgeService.assignBadge(user, 0);
  //     res.status(200).send(result);
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };

  getOwnedBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const studentId = req.user?.username as string;
      const student =
        await this.studentService.getStudentByStudentId(studentId);

      const badges = await this.badgeService.getOwnedBadge(student);
      res.status(200).send(badges);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export { BadgeController };

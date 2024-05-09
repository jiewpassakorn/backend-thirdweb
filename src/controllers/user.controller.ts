import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { File } from '../middlewares/upload.middleware';
import { UploadService } from '../services/upload.service';

class UserController {
  private userService: UserService;
  private uploadService: UploadService;

  constructor() {
    this.userService = new UserService();
    this.uploadService = new UploadService();
  }

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user: IUser = req.body;
      const result = await this.userService.getUserById(user._id);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user: IUser = req.body;
      const createdUser = await this.userService.createUser(user);
      res.status(201).send(createdUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user: IUser = req.body;
      const updatedUser = await this.userService.updateUser(user._id, user);
      res.status(200).send(updatedUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user: IUser = req.body;
      const deletedUser = await this.userService.deleteUser(user._id);
      res.status(200).send(deletedUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export { UserController };

import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';

class RoleMiddleware {
  constructor() {}
  checkAdminRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (user.role !== 'admin') {
        const error = new Error('Unauthorized');
        (error as any).status = 401;
        throw error;
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export { RoleMiddleware };

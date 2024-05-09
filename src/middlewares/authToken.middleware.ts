// Middleware/AuthTokenMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { Types } from 'mongoose';
import { IUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';

interface UserPayload {
  userId: Types.ObjectId;
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

class AuthTokenMiddleware {
  private userService: UserService;
  private authService: AuthService;
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }
  verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log('req.headers:', req.headers);
      const secretKey = process.env.JWT_SECRET as string;
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        const error = new Error('No token found');
        (error as any).status = 401;
        throw error;
      }

      const decoded = jwt.verify(token, secretKey) as UserPayload;

      const user = await this.userService.getUserById(decoded.userId);

      req.user = user as IUser;

      next();
    } catch (error) {
      console.log(error);
      (error as any).status = 401;

      if (error instanceof jwt.TokenExpiredError) {
        error.message = 'Token expired';
        (error as any).status = 401;
      } else if (error instanceof jwt.JsonWebTokenError) {
        error.message = 'Invalid token';
        (error as any).status = 401;
      }

      next(error);
    }
  };
}

export { AuthTokenMiddleware };

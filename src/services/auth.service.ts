import { Types } from 'mongoose';
import User, { IUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { sign, verify } from 'jsonwebtoken';

class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(username: string, password: string) {
    const secret = process.env.JWT_SECRET || '';
    console.log('username:', username);
    const user = await this.userService.getUserByUsername(username);

    const isMatch = await this.userService.comparePassword(
      password,
      user.password
    );

    const token = sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: '1h'
    });
    if (!token) throw new Error('Token not generated');

    return { user, token };
  }

  async generateUploadToken() {
    const secret = process.env.JWT_SECRET_UPLOAD || '';
    const token = sign({}, secret, { expiresIn: '15m' });
    return token;
  }
}

export { AuthService };

export const generateExpiredToken = (token: string) => {
  const secret = process.env.JWT_SECRET || '';
  const decoded = verify(token, secret) as { userId: Types.ObjectId };
  return sign({ userId: decoded.userId }, secret, { expiresIn: '1s' });
};

import User, { IUser } from '../models/user.model';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

class UserService {
  async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async getUserByStudentId(studentId: string) {
    const user = await User.findOne({ 'personalInfo.studentId': studentId });
    console.log('getUserByStudentId:', user);
    return user;
  }

  async getUserById(_id: mongoose.Types.ObjectId) {
    try {
      const user = await User.findById(_id);
      console.log('user:', user);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async createUser(user: any) {
    try {
      // const existUser = await this.getUserByStudentId(user.username);
      // if (existUser) throw new Error('User already exists');
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({ ...user, password: hashedPassword });
      return newUser.save();
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async updateUser(_id: mongoose.Types.ObjectId, user: IUser) {
    try {
      const existUser = await this.getUserById(_id);
      if (!existUser) throw new Error('User not found');
      const updatedUser = await User.findByIdAndUpdate(_id, user, {
        new: true
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async deleteUser(_id: mongoose.Types.ObjectId) {
    try {
      const existUser = await this.getUserById(_id);
      if (!existUser) throw new Error('User not found');
      const deletedUser = await User.findByIdAndDelete(_id);
      return deletedUser;
    } catch (error) {
      console.log(error);
      (error as any).status = 502;
      throw error;
    }
  }

  async comparePassword(
    providedPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(providedPassword, hashedPassword);
      if (!isMatch) throw new Error('Invalid password');
      return isMatch;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export { UserService };

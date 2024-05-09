import { AsyncStorage } from '@thirdweb-dev/wallets';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import Student, { IStudent } from '../models/student.model';

class MyStorage implements AsyncStorage {
  public student = {} as IStudent;
  // constructor() {
  //   this.student = {} as IStudent;
  // }

  async setId(student: IStudent) {
    this.student = student;
  }
  async getItem(key: string): Promise<string | null> {
    try {
      const studentId = this.student.studentId;
      console.log('key:', key);
      const student = await Student.findOne({ studentId });
      // const localWallet = await User.findById(userId);
      console.log('student:', student);
      if (!student?.localWallet) {
        throw new Error('Local wallet not found');
      }
      return student.localWallet;
    } catch (error) {
      console.error('Error in getting local wallet:', error);
      throw new Error(`Database ${error}`);
    }
  }
  async setItem(key: string, value: string): Promise<void> {
    try {
      // const userId = this.user._id;
      const studentId = this.student.studentId;

      const createdLocalWallet = await Student.findOneAndUpdate(
        { studentId },
        {
          localWallet: value
        }
      );
      if (!createdLocalWallet) {
        throw new Error('Local wallet not created');
      }
    } catch (error) {
      console.error('Error setting data in storage:', error);
      throw new Error(`Database ${error}`);
    }
  }
  async removeItem(key: string): Promise<void> {
    try {
      const studentId = this.student.studentId;

      const removedLocalWallet = await Student.findOneAndUpdate(
        { studentId },
        {
          localWallet: ''
        }
      );

      // const removedLocalWallet = await Student.findOneAndUpdate(
      //   this.student.studentId,
      //   {
      //     localWallet: ''
      //   }
      // );
      if (!removedLocalWallet) {
        throw new Error('Local wallet not found');
      }
    } catch (error) {
      console.error('Error removing data from storage:', error);
      throw new Error(`Database ${error}`);
    }
  }
}

export { MyStorage };

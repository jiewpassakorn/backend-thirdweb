import Student, { IStudent } from '../models/student.model';

class StudentService {
  constructor() {}
  async checkExistedStudent(studentId: string) {
    try {
      const student = await Student.findOne({ studentId });
      if (student) {
        const error = new Error('Student already exists');
        (error as any).status = 400;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  async create(student: IStudent) {
    try {
      await this.checkExistedStudent(student.studentId);
      const studentCreated = await Student.create(student);
      if (!studentCreated) {
        const error = new Error('Student not created');
        (error as any).status = 500;
        throw error;
      }
      return studentCreated;
    } catch (error) {
      throw error;
    }
  }
  async update(student: IStudent) {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        student._id,
        student,
        { new: true }
      );
      return updatedStudent;
    } catch (error) {
      throw error;
    }
  }
  async delete(studentId: string) {
    try {
      const student = await Student.findOneAndDelete({ studentId });
      if (!student) {
        throw new Error('Student not found');
      }
      return { message: 'Student deleted' };
    } catch (error) {
      throw error;
    }
  }

  async getStudentByStudentId(studentId: string) {
    try {
      const student = await Student.findOne({ studentId });
      if (!student) {
        throw new Error('Student not found');
      }
      return student;
    } catch (error) {
      throw error;
    }
  }
}

export { StudentService };

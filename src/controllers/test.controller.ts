import { NextFunction, Request, Response } from 'express';

class TestController {
  constructor() {}
  test = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.test2();
      if (!result) {
        const error = new Error('result not found');
        (error as any).status = 404;
        throw error;
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  async test2() {
    try {
      //connecting to db
      const connetingtoDB = true;
      if (!connetingtoDB) {
        const error = new Error('connetingtoDB');
        (error as any).status = 501;
        throw error;
      }
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export { TestController };

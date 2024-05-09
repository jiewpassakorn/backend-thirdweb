import mongoose, { Connection } from 'mongoose';

export class Database {
  private static instance: Database;
  private connection: any;

  private constructor() {
    this.connection = null;
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    try {
      if (!this.connection) {
        const mongoURI = process.env.MONGO_URI || '';
        const dbName = process.env.MONGO_DB_NAME || '';

        this.connection = await mongoose.connect(mongoURI, {
          dbName
        });

        console.log(
          `✅ Connected to Database (MongoDB) - Database Name : ${dbName}`
        );
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  getConnection(): Connection | null {
    return this.connection;
  }
}

const database = Database.getInstance();

export default async function connectDB(): Promise<void> {
  await database.connect();
}

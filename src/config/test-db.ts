import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connect = async () => {
  const mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();

  const mongooseOpts = {
    dbName: 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10
  };

  await mongoose.connect(uri, mongooseOpts);
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

import { connect, connection } from 'mongoose';

const connectToMongo = async (): Promise<void> => {
  const isTestEnv = process.env['NODE_ENV'] === 'test';
  const mongodbURI = isTestEnv
    ? (process.env['MONGODB_TEST_URI'] as string)
    : (process.env['MONGODB_URI'] as string);

  await connect(mongodbURI);
  console.log(`Connected to MongoDB (db: ${mongodbURI.split('/').pop()})`);
};

const disconnectMongo = async (): Promise<void> => {
  await connection.close();
};

export { connectToMongo, disconnectMongo };

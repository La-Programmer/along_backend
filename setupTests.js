const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();   

  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  await mongoServer.stop();
});
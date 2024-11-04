import express from 'express';
import dotenv from "dotenv";
import controllerRouting from './routes/index'
import connectToDb from './config/database';
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors({
  origin: ['http://localhost:3000', 'https://along1.vercel.app']
}));

const port = process.env.PORT || 3000;

controllerRouting(app);

app.listen(port, async () => {
  await connectToDb();
  console.log(`Server is up and running on port ${port}`);
})

export default app

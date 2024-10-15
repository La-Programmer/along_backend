import express from 'express';
import dotenv from "dotenv";
import controllerRouting from './routes/index'
import connectToDb from './config/database';
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = process.env.PORT || 3000;

controllerRouting(app);

app.listen(port, () => {
  connectToDb();
  console.log(`Server is up and running on port ${port}`);
})

import express from 'express';
import controllerRouting from './routes/index'
import connectToDb from './config/database';
const bodyParser = require("body-parser");

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = 3000;

controllerRouting(app);

app.listen(port, () => {
  connectToDb();
  console.log(`Server is running on http://localhost:${port}`);
})

import express from 'express';
import controllerRouting from './routes/index'

const app = express();

const port = 3000;

controllerRouting(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

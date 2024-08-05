import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authenticrouter from "../routes/authentic.route.js";
import carrouter from "../routes/car.route.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors({ origin: 'https://api-front-cnqe.onrender.com' }));

app.use(express.json());

app.use('/api/users', authenticrouter);
app.use('/api/cars', carrouter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
  });

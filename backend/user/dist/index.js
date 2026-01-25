import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from 'redis';
import userRoutes from "./routes/user.js";
import { connectRabbitmq } from "./config/rabbitmq.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
connectDb();
connectRabbitmq();
export const redisCliend = createClient({
    url: process.env.REDIS_URL,
});
redisCliend.connect().then(() => console.log("connected to redis")).catch(console.error);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1', userRoutes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map
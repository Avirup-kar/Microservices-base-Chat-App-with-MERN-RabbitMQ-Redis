import express from "express"
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";

dotenv.config();
startSendOtpConsumer();
const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

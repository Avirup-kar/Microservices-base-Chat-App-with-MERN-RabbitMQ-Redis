import amqp from "amqplib";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
let channel = null;
export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();
        const queueName = 'send-otp';
        await channel.assertQueue(queueName, { durable: true });
        console.log("✅ Mail Service consumer started, listening for otp emils");
        channel.consume(queueName, async (msg) => {
            try {
                if (msg !== null) {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.MAIL_USER, // mailUser
                            pass: process.env.MAIL_PASSWORD, // app password
                        },
                    });
                    await transporter.sendMail({
                        from: `"Chat_App" <avirupk57@gmail.com>`,
                        to,
                        subject,
                        text: body
                    });
                    console.log(`Otp mail send to: ${to}`);
                    channel?.ack(msg);
                }
            }
            catch (error) {
                console.log("❌ Failed to send otp:", error);
            }
        });
    }
    catch (error) {
        console.log("❌ Failed to connect RabbitMQ consumer:", error);
    }
};
//# sourceMappingURL=consumer.js.map
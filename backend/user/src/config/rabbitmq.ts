import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export const connectRabbitmq = async () => {
  try {
    const connection = await amqp.connect(process.env.RABITMQ_URL || "");
    channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.log("❌ Failed to connect RabbitMQ:", error);
  }
};
        

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initalized");
    return;
  };

  await channel.assertQueue(queueName, {durable: true});

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  })
}
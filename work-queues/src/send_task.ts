import amqplib from "amqplib";

const queueName = "task";
const msg = process.argv.slice(2).join(" ") || "Hello World!";

const sendTask = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });

  console.log(`Sent message to ${queueName}: ${msg}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendTask();

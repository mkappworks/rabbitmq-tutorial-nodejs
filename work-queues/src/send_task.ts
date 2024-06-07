import amqplib from "amqplib";

const queueName1 = "task";
const msg1 = process.argv.slice(2).join(" ") || "Hello World!";

const sendToQueue = async (
  connection: amqplib.Connection,
  queueName: string,
  msg: string
) => {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  console.log(`Sent message to ${queueName}: ${msg}`);
};

const sendTask = async () => {
  const connection = await amqplib.connect("amqp://localhost");

  await sendToQueue(connection, queueName1, msg1);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendTask();

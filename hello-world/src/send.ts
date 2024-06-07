import amqplib from "amqplib";

const queueName1 = "hello";
const msg1 = "Hello World!";
const queueName2 = "mk";
const msg2 = "Hello MK!";

const sendToQueue = async (
  connection: amqplib.Connection,
  queueName: string,
  msg: string
) => {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log(`Sent message to ${queueName}: ${msg}`);
};

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");

  await sendToQueue(connection, queueName1, msg1);
  await sendToQueue(connection, queueName2, msg2);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();

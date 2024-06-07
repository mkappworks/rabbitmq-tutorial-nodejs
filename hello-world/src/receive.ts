import amqplib from "amqplib";

const queueName1 = "hello";
const queueName2 = "mk";

const receiveFromQueue = async (
  connection: amqplib.Connection,
  queueName: string
) => {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName1, { durable: false });

  console.log(`Waiting for messages in ${queueName}`);

  channel.consume(
    queueName,
    (msg) => {
      console.log(
        `-> Received message from ${queueName}: ${msg.content.toString()}`
      );
    },
    { noAck: true }
  );
};

const receiveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");

  await receiveFromQueue(connection, queueName1);
  await receiveFromQueue(connection, queueName2);
};

receiveMsg();

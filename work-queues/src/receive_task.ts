import amqplib from "amqplib";

const queueName = "task";

const receiveTask = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  console.log(`Waiting for messages in ${queueName}`);

  channel.consume(
    queueName,
    (msg) => {
      const seconds = msg.content.toString().split(".").length - 1;
      console.log(
        `-> Received message from ${queueName}: ${msg.content.toString()}`
      );

      setTimeout(() => {
        console.log("Done resize image");
        channel.ack(msg);
      }, seconds * 1000);
    },
    { noAck: false }
  );
};

receiveTask();

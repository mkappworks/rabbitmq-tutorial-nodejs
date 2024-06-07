import amqplib from "amqplib";

const exchangeName = "logs";

const receiveLogs = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  console.log(`Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, exchangeName, "");

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log(
          `-> Received message from queue ${q.queue}: ${msg.content.toString()}`
        );
      }
    },
    { noAck: true }
  );
};

receiveLogs();

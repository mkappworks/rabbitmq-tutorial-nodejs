import amqplib from "amqplib";

const args = process.argv.slice(2);

// Check if there are any arguments passed
// If not, print usage and exit
if (args.length === 0) {
  console.log("Usage: receive_log.ts [info] [warning] [error]");
  process.exit(1);
}

const exchangeName = "direct_logs";

const receiveLogs = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, "direct", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  console.log(`Waiting for messages in queue: ${q.queue}`);

  // Bind the queue to the exchange with the specified routing keys
  // can have multiple routing keys
  args.forEach((severity) => {
    channel.bindQueue(q.queue, exchangeName, severity);
  });

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log(
          `-> Received message from queue ${q.queue} and routing key ${
            msg.fields.routingKey
          }: ${msg.content.toString()}`
        );
      }
    },
    { noAck: true }
  );
};

receiveLogs();

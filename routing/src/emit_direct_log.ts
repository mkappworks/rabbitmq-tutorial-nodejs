import amqplib from "amqplib";

const exchangeName = "direct_logs";
const args = process.argv.slice(2);
const logType = args[0];
const msg = args[1] || "Hello World!";

const emitTask = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, "direct", { durable: false });
  channel.publish(exchangeName, logType, Buffer.from(msg));

  console.log(
    `Sent message to ${exchangeName} with log type ${logType}: ${msg}`
  );

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

emitTask();

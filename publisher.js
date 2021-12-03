require("dotenv").config();
const nsq = require("nsqjs");
const nsqdHost = process.env.NSQD_HOST;
const nsqdPort = process.env.NSQD_PORT;

try {
  // predefined NSQ connection
  const writer = new nsq.Writer(nsqdHost, nsqdPort);
  const topic = "NOTIFICATION";

  // initialize NSQ connect
  writer.connect();

  // when connection is ready to push message
  writer.on("ready", () => {
    console.log(
      `writer on ready state, sending message every second on topic: ${topic}`
    );

    // send welcome message
    writer.publish(topic, {
      type: "message",
      msg: "Hello welcome to NSQ...",
    });

    // send message every 1 second
    setInterval(() => {
      const date = new Date();
      writer.publish(topic, {
        type: "time",
        msg: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      });
    }, 1000);
  });

  // when error occurs
  writer.on("error", (error) => {
    console.log("Writer error", error);
  });

  // when connection is closed
  writer.on("closed", () => {
    console.log("Writer closed");
  });
} catch (error) {
  console.log(error);
}

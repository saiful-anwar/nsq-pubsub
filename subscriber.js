require("dotenv").config();
const nsq = require("nsqjs");
const nsqHost = process.env.NSQ_LOOKUP_HTTP_HOST;
const nsqPort = process.env.NSQ_LOOKUP_HTTP_PORT;

try {
  // predefined NSQ connection
  const topic = "NOTIFICATION";
  const channel = "MY_CHANNEL";
  const reader = new nsq.Reader(topic, channel, {
    lookupdHTTPAddresses: `${nsqHost}:${nsqPort}`,
  });

  // initialize NSQ connect
  reader.connect();

  // when error occurs
  reader.on("error", (err) => {
    console.log("[NSQ] Reader error:", err);
  });

  // when connected to NSQD
  reader.on("nsqd_connected", (host, port) => {
    console.info(`[NSQ] Connected on nsq{${host}:${port}} listening for topic ${topic}`);
  });

  // handle incoming message
  reader.on("message", (msg) => {
    // print message to the console
    console.log(msg.json());

    // mark incoming message as read/finish
    msg.finish();
  });
} catch (error) {
  console.log(error);
}

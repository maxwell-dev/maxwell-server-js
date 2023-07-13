import { Options as ConntionOptions } from "maxwell-utils";
import { Server, Request, Reply, Master, Publisher } from "../src";

const master = Master.singleton(["localhost:8081"], new ConntionOptions());
const publisher = new Publisher(master);

async function loop() {
  for (let i = 0; i < 100; i++) {
    try {
      const rep = await publisher.publish(
        "topic_100",
        new TextEncoder().encode("hello")
      );
      console.log("successufly publish: ", rep);
    } catch (e) {
      console.error("publish error: ", e);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
setTimeout(loop, 1000);

const server = new Server({
  master_endpoints: ["localhost:8081"],
  port: 30000,
});

server.addWsRoute("/hello", async (req: Request) => {
  const reply: Reply = { payload: req };
  return reply;
});

server.start();

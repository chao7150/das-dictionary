import fastify from "fastify";
import { Static, Type } from "@sinclair/typebox";

const app = fastify({ logger: true });

const Titles = Type.Object({
  titles: Type.String(),
});
type TitlesType = Static<typeof Titles>;

app.get<{ Querystring: TitlesType }>(
  "/work-id",
  {
    schema: {
      querystring: Titles,
      response: {
        200: {
          type: "array",
          items: { type: "integer" },
        },
      },
    },
  },
  async (request, reply) => {
    return request.query.titles;
  },
);

app.get("/status", async (request, reply) => {
  return "OK";
});

const start = async () => {
  try {
    // デフォルトの127.0.0.1だとdockerの外から通信を受けられない
    await app.listen(3000, "0.0.0.0");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

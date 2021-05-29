import fastify from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { PrismaClient } from "@prisma/client";

const app = fastify({
  logger: { level: "info" },
  ajv: { customOptions: { removeAdditional: false } },
});
const prisma = new PrismaClient();

const Work = Type.Object({
  id: Type.Number(),
  title: Type.String(),
});
type WorkType = Static<typeof Work>;

const WorkQuery = Type.Union([
  Type.Object({ id: Type.Number() }),
  Type.Object({ title: Type.String() }),
]);
type WorkQueryType = Static<typeof WorkQuery>;
console.log(JSON.stringify(WorkQuery));

const ErrorObj = Type.Object({
  title: Type.String(),
  status: Type.String(),
  detail: Type.String(),
});
type ErrorObjType = Static<typeof ErrorObj>;

app.get<{ Querystring: WorkQueryType; Reply: WorkType | ErrorObjType }>(
  "/work",
  {
    preValidation: (request, reply, done) => {
      done();
    },
    schema: {
      querystring: WorkQuery,
      response: {
        200: Work,
        404: ErrorObj,
      },
    },
  },
  async (request, reply) => {
    if ("id" in request.query) {
      return prisma.work.findFirst({
        where: { id: { equals: request.query.id } },
        rejectOnNotFound: true,
      });
    }
    if (request.query.title) {
      return prisma.work.findFirst({
        where: { title: { contains: request.query.title } },
        rejectOnNotFound: true,
      });
    }
    throw new Error("no valid query");
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

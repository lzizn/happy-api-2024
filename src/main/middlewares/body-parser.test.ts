import type { IncomingHttpHeaders } from "http";
import request from "supertest";

import { app } from "@/main/config/app";

describe("bodyParser middleware", () => {
  let requestHeaders: IncomingHttpHeaders;

  it("Should parse body successfully", async () => {
    app.post("/test_body_parser", (req, res) => {
      requestHeaders = req.headers;
      res.send(req.body);
    });

    await request(app)
      .post("/test_body_parser")
      .send({ test: 123 })
      .expect({ test: 123 });

    expect(requestHeaders["content-type"]).toBe("application/json");
  });
});

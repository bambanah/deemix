// Taken from https://github.com/visionmedia/supertest

import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

describe("cookie parser", () => {
  const app = express();
  app.use(cookieParser());

  app.get("/", (_, res) => {
    res.cookie("cookie", "hey");
    res.send();
  });

  app.get("/return", (req, res) => {
    if (req.cookies.cookie) res.send(req.cookies.cookie);
    else res.send(":(");
  });

  const agent = request.agent(app);

  it("should save cookies", (done) => {
    agent.get("/").expect("set-cookie", "cookie=hey; Path=/", done);
  });

  it("should send cookies", (done) => {
    agent.get("/return").expect("hey", done);
  });
});

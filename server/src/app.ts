import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("in base route /");
});

export default app;

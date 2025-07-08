const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRouter");
const messageRouter = require("./routes/messageRouter");
const ConnectDB = require("./lib/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { app, io, server } = require("./lib/socket");

dotenv.config();



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/api/`);
  ConnectDB();
});

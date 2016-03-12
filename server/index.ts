/// <reference path="../typings/main.d.ts" />
/// <reference path="../shared.d.ts" />

import * as SocketIO from "socket.io";
import * as express from "express";
import * as http from "http";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server, { transports: [ "websocket" ]});
export { io };

app.use("/", express.static(`${__dirname}/../public`));

server.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

import * as game from "./game";
io.on("connection", (socket) => { game.addPlayer(socket); });

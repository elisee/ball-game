import * as io from "socket.io-client";
import * as renderer from "./renderer";
import * as sidebar from "./sidebar";
import * as status from "./status";
import * as input from "./renderer/input";
import * as shared from "../shared";

export let pub: Game.GamePub;
export let players: { byId: { [id: string]: Game.PlayerPub; } };
export let myPlayerId: string;

export let socket: SocketIOClient.Socket;

export function connect() {
  socket = io.connect({ transports: [ "websocket" ], reconnection: false });
  socket.on("welcome", onWelcome);
  socket.on("disconnect", onDisconnect);
}

function onWelcome(data: Game.GamePub, playerId: string) {
  myPlayerId = playerId;
  pub = data;
  players = { byId: {} };

  socket.on("addPlayer", onAddPlayer);
  socket.on("removePlayer", onRemovePlayer);
  socket.on("chat", onChat);
  socket.on("setName", onSetName);
  socket.on("joinTeam", onJoinTeam);
  socket.on("tick", onTick);

  socket.on("startMatch", onStartMatch);
  socket.on("catchBall", onCatchBall);
  socket.on("throwBall", onThrowBall);
  socket.on("endMatch", onEndMatch);

  if (pub.match != null) {
    status.setTimer(pub.match.ticksLeft);
  } else {
    status.setText("Waiting for players...");
  }

  for (const player of pub.players) {
    players.byId[player.id] = player;
    if (player.avatar != null) renderer.addPlayer(player);
    sidebar.players.add(player);
  }

  const myPlayer = players.byId[myPlayerId];
  sidebar.me.setupName(myPlayer.name, false);
  sidebar.me.setupTeam(myPlayer.avatar != null ? myPlayer.avatar.teamIndex : null, pub.match != null);
  sidebar.chat.setupInput(false);

  if (localStorage["playerName"] != null) sidebar.me.setName(localStorage["playerName"]);

  setInterval(sendInput, shared.tickInterval);
}

function onAddPlayer(player: Game.PlayerPub) {
  pub.players.push(player);
  players.byId[player.id] = player;

  if (player.avatar != null) renderer.addPlayer(player);
  sidebar.players.add(player);
}

function onRemovePlayer(playerId: string) {
  sidebar.players.remove(playerId);

  const player = players.byId[playerId];
  if (player.avatar != null) renderer.removePlayer(playerId);

  pub.players.splice(pub.players.indexOf(player), 1);
  delete players.byId[playerId];
}

function onChat(playerId: string, text: string) {
  sidebar.chat.append(players.byId[playerId].name, text);
}

function onSetName(playerId: string, name: string) {
  players.byId[playerId].name = name;
  sidebar.players.setName(playerId, name);
}

function onJoinTeam(playerId: string, avatar: Game.AvatarPub) {
  const player = players.byId[playerId];
  player.avatar = avatar;

  if (playerId === myPlayerId) sidebar.me.setupTeam(avatar.teamIndex, true);

  sidebar.players.setTeam(playerId, avatar.teamIndex);
  renderer.addPlayer(player);
}

function sendInput() {
  if (players.byId[myPlayerId].avatar != null) socket.emit("input", input.prediction);
}

function onTick(data: Game.TickData) {
  for (const playerId in data.playerMoves) {
    const move = data.playerMoves[playerId];
    const avatar = players.byId[playerId].avatar;
    avatar.x = move.x;
    avatar.z = move.z;
    avatar.jump = move.jump;
    avatar.angleY = move.angleY;
    avatar.angleX = move.angleX;
  }

  if (pub.match != null) {
    pub.match.ticksLeft--;
    status.setTimer(pub.match.ticksLeft);

    if (pub.ball.playerId == null) shared.tickBall(pub.ball);
  }

  renderer.tick();
}

function onStartMatch(match: Game.MatchPub) {
  pub.match = match;
}

function onCatchBall(playerId: string) {
  pub.ball.playerId = playerId;
  renderer.catchBall(playerId);
}

function onThrowBall(ball: Game.BallPub) {
  const thrownByMe = pub.ball.playerId === myPlayerId;
  pub.ball = ball;
  renderer.throwBall(pub.ball, thrownByMe);
}

function onEndMatch() {
  const ball = pub.ball;
  ball.x = ball.z = 0;
  ball.y = 1;
  ball.vx = ball.vy = ball.vz = 0;
  ball.playerId = null;

  for (const playerId in players.byId) {
    const player = players.byId[playerId];
    player.avatar = null;
  }

  renderer.reset();
  pub.match = null;
  sidebar.players.clearTeams();
  status.setText("Game over!");

  sidebar.me.setupTeam(null, false);
}

function onDisconnect() {
  renderer.stop();
  document.body.innerHTML = "Whoops, you have been disconnected. Plz reload the page.";
}

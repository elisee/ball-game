import * as io from "socket.io-client";
import * as matchRenderer from "./matchRenderer";
import * as sidebar from "./sidebar";
import * as status from "./status";

let pub: Game.GamePub;
let players: { byId: { [id: string]: Game.PlayerPub } };

export let socket: SocketIOClient.Socket;
export let myPlayerId: string;

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

  if (pub.match != null) {
    status.setTimer(pub.match.ticksLeft);
  } else {
    status.setText("Waiting for players...");
  }

  for (const player of pub.players) {
    players.byId[player.id] = player;
    matchRenderer.addPlayer(player);
    sidebar.players.add(player);
  }

  const myPlayer = players.byId[myPlayerId];
  sidebar.me.setupName(myPlayer.name, false);
  sidebar.me.setupTeam(myPlayer.avatar != null ? myPlayer.avatar.teamIndex : null, pub.match != null);
  sidebar.chat.setupInput(false);

  if (localStorage["playerName"] != null) sidebar.me.setName(localStorage["playerName"]);
}

function onAddPlayer(player: Game.PlayerPub) {
  pub.players.push(player);
  players.byId[player.id] = player;
  matchRenderer.addPlayer(player);
  sidebar.players.add(player);
}

function onRemovePlayer(playerId: string) {
  sidebar.players.remove(playerId);
  matchRenderer.removePlayer(playerId);

  const player = players.byId[playerId];
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
  players.byId[playerId].avatar = avatar;

  if (playerId === myPlayerId) sidebar.me.setupTeam(avatar.teamIndex, true);

  sidebar.players.setTeam(playerId, avatar.teamIndex);
  matchRenderer.setPlayerAvatar(playerId, avatar);
}

function onTick(data: any) {
  // NOTHING
}

function onMatchEnd() {
  sidebar.players.clearTeams();
  status.setText("Game over!");
}

function onDisconnect() {
  matchRenderer.stop();
  document.body.innerHTML = "Whoops, you have been disconnected. Plz reload the page.";
}

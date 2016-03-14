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
  socket.on("score", onScore);
  socket.on("endMatch", onEndMatch);

  if (pub.match != null) {
    status.setTimer(pub.match.ticksLeft);
    status.setScores(pub.teams[0].score, pub.teams[1].score);
  } else {
    status.setText("Waiting for players...");
  }

  for (const player of pub.players) {
    players.byId[player.id] = player;
    if (player.avatar != null) renderer.addPlayer(player);
    sidebar.players.add(player);
  }
  sidebar.players.setTeamScore(0, pub.teams[0].score);
  sidebar.players.setTeamScore(1, pub.teams[1].score);


  const myPlayer = players.byId[myPlayerId];
  sidebar.me.setupName(myPlayer.name, false);

  sidebar.me.setupTeam(myPlayer.avatar != null ? myPlayer.avatar.teamIndex : null, myPlayer.avatar != null);
  sidebar.chat.setupInput(false);

  if (localStorage["playerName"] != null) sidebar.me.setName(localStorage["playerName"]);

  setInterval(sendInput, shared.tickInterval);
}

function onAddPlayer(player: Game.PlayerPub) {
  pub.players.push(player);
  players.byId[player.id] = player;
  sidebar.chat.appendInfo(`${player.name} connected.`, true);

  if (player.avatar != null) renderer.addPlayer(player);
  sidebar.players.add(player);
}

function onRemovePlayer(playerId: string) {
  sidebar.players.remove(playerId);

  const player = players.byId[playerId];
  sidebar.chat.appendInfo(`${player.name} has disconnected.`, false);
  if (player.avatar != null) renderer.removePlayer(playerId);

  pub.players.splice(pub.players.indexOf(player), 1);
  delete players.byId[playerId];
}

function onChat(playerId: string, text: string) {
  sidebar.chat.append(players.byId[playerId].name, text);
}

function onSetName(playerId: string, name: string) {
  sidebar.chat.appendInfo(`${players.byId[playerId].name} changed his name to ${name}.`, false);
  players.byId[playerId].name = name;
  renderer.setPlayerName(playerId, name);
  sidebar.players.setName(playerId, name);
}

function onJoinTeam(playerId: string, avatar: Game.AvatarPub) {
  const player = players.byId[playerId];
  player.avatar = avatar;

  if (playerId === myPlayerId) sidebar.me.setupTeam(avatar.teamIndex, true);

  sidebar.players.setTeam(playerId, avatar.teamIndex);
  renderer.addPlayer(player);

  const missingPlayers = shared.maxPlayersPerTeam * 2 - Object.keys(players.byId).length;
  status.setText(`Waiting for ${missingPlayers} more players...`);
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
    avatar.jump.timer = move.jump.timer;
    avatar.jump.withBall = move.jump.withBall;
    avatar.angleY = move.angleY;
    avatar.angleX = move.angleX;
    avatar.catching = move.catching;
  }

  if (pub.match != null) {
    pub.match.ticksLeft--;

    if (pub.match.scoreTimer > 0) {
      pub.match.scoreTimer--;
      if (pub.match.scoreTimer === 0) {
        shared.resetBall(pub.ball);
        renderer.resetBall();
        renderer.resetBaskets();
      }
    status.setText("Scoooore!");
    } else {
      status.setTimer(pub.match.ticksLeft);
    }

    if (pub.ball.playerId == null) shared.tickBall(pub.ball);
  }

  renderer.tick();
}

function onStartMatch(match: Game.MatchPub) {
  pub.match = match;
  sidebar.players.setTeamScore(0, 0);
  sidebar.players.setTeamScore(1, 0);
  status.setScores(pub.teams[0].score, pub.teams[1].score);

  sidebar.chat.appendInfo("The match starts!", true);
}

function onCatchBall(playerId: string) {
  pub.ball.playerId = playerId;
  renderer.catchBall(playerId);
}

function onThrowBall(ball: Game.BallPub) {
if (pub.ball.playerId === myPlayerId) renderer.ballThrownTimer = 20;
  pub.ball = ball;
  renderer.throwBall(pub.ball);
}

function onScore(teamIndex: number, playerId: string) {
  pub.match.scoreTimer = shared.resetBallDuration;
  pub.teams[teamIndex].score += 2;
  sidebar.players.setTeamScore(teamIndex, pub.teams[teamIndex].score);
  renderer.score(teamIndex);

  const player = players.byId[playerId];
  const teamName = (teamIndex === 0) ? "RED" : "BLUE";
  if (player != null && player.avatar != null) {
    if (player.avatar.teamIndex === teamIndex) {
      player.avatar.score += 2;
      sidebar.players.setPlayerScore(playerId, player.avatar.score);
      sidebar.chat.appendInfo(`YAY! ${player.name} scores for team ${teamName}!`, false);
    } else {
      sidebar.chat.appendInfo(`WHOOPS! ${player.name} scores for team ${teamName}!`, false);
    }
  } else {
    sidebar.chat.appendInfo(`OH! ${teamName} scores!`, false);
  }

  status.setScores(pub.teams[0].score, pub.teams[1].score);
}

function onEndMatch() {
  let result: string;
  if (pub.teams[0].score > pub.teams[1].score) result = "Team RED wins!";
  else if (pub.teams[1].score > pub.teams[0].score) result = "Team BLUE wins!";
  else result = "It's a tie!";
  result += ` ${pub.teams[0].score} — ${pub.teams[1].score}`;
  status.setText(result);
  sidebar.chat.appendInfo(result, true);

  pub.teams[0].score = 0;
  pub.teams[1].score = 0;

  const ball = pub.ball;
  shared.resetBall(ball);
  renderer.resetBall();
  renderer.resetBaskets();

  for (const playerId in players.byId) {
    const player = players.byId[playerId];
    player.avatar = null;
  }

  renderer.reset();
  pub.match = null;
  sidebar.players.clearTeams();

  sidebar.me.setupTeam(null, false);
}

function onDisconnect() {
  renderer.stop();
  document.body.innerHTML = "Whoops, you have been disconnected. Plz reload the page.";
}

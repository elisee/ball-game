import { io } from "./index";
import * as game from "./game";
import * as shared from "../shared";

export function start() {
  game.pub.match = { ticksLeft: shared.matchDurationTicks };
  io.in("game").emit("startMatch", game.pub.match);
}

export function tick() {
  game.pub.match.ticksLeft--;
  if (game.pub.match.ticksLeft === 0) end();
}

export function end() {
  game.pub.match = null;

  const ball = game.pub.ball;
  ball.x = ball.z = 0;
  ball.y = 1;
  ball.vx = ball.vy = ball.vz = 0;
  ball.playerId = null;

  for (const player of game.players.active) {
    player.pub.avatar = null;
  }
  game.players.active.length = 0;

  game.teams[0].pub.score = 0;
  game.teams[0].players.length = 0;
  game.teams[1].pub.score = 0;
  game.teams[1].players.length = 0;

  io.in("game").emit("endMatch");
}

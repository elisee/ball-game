import * as game from "./game";
import * as shared from "../shared";

let tickIntervalId: NodeJS.Timer;

export function start() {
  game.pub.match = { ticksLeft: shared.matchDurationTicks };
  tickIntervalId = setInterval(tick, shared.tickInterval);
}

function end() {
  game.pub.match = null;

  for (const player of game.players.active) {
    player.pub.avatar = null;
  }
  game.players.active.length = 0;

  game.teams[0].pub.score = 0;
  game.teams[0].players.length = 0;
  game.teams[1].pub.score = 0;
  game.teams[1].players.length = 0;
}

function tick() {
  game.pub.match.ticksLeft--;
  if (game.pub.match.ticksLeft === 0) end();
}

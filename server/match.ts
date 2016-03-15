import { io, log } from "./index";
import * as game from "./game";
import * as shared from "../shared";

export function start() {
  game.pub.match = { ticksLeft: shared.matchDurationTicks, scoreTimer: 0 };
  io.in("game").emit("startMatch", game.pub.match);
  log("Match started.");
}

export function tick() {
  game.pub.match.ticksLeft--;

  const ball = game.pub.ball;
  if (game.pub.match.scoreTimer > 0) {
    game.pub.match.scoreTimer--;
    if (game.pub.match.scoreTimer === 0) shared.resetBall(ball);
  }

  if (ball.playerId == null) {
    let { hitBasketTeamIndex: scoringTeamIndex } = shared.tickBall(ball);
    if (scoringTeamIndex != null) {
      const scoringPlayer = game.players.byId[game.lastBallPlayerId];
      // NOTE: Player might have disconnected in the meantime
      if (scoringPlayer != null && scoringPlayer.pub.avatar != null) {
        if (scoringPlayer.pub.avatar.teamIndex === scoringTeamIndex) scoringPlayer.pub.avatar.score += 2;
      }

      io.in("game").emit("score", scoringTeamIndex, game.lastBallPlayerId);
      game.pub.match.scoreTimer = shared.resetBallDuration;
      game.pub.teams[scoringTeamIndex].score += 2;
    }
  }
}

export function end() {
  log(`Match ended: ${game.teams[0].pub.score} — ${game.teams[1].pub.score}.`);
  log(`Players were: ${game.players.active.map((x) => x.pub.name).join(", ")}.`);

  game.pub.match = null;

  shared.resetBall(game.pub.ball);

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

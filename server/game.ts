import { io } from "./index";
import * as shared from "../shared";
import Player from "./Player";
import * as match from "./match";

interface Team { pub: Game.TeamPub; players: Player[]; }

export const pub: Game.GamePub = {
  match: null,
  players: [],
  ball: {
    x: 0, y: 1, z: 0,
    vx: 0, vy: 0, vz: 0,
    playerId: null,
  },
  teams: []
};

export const players: {
  byId: { [id: string]: Player; };
  all: Player[];
  active: Player[];
} = { byId: {}, all: [], active: [] };

export const teams: Team[] = [
  { pub: { score: 0 }, players: [] },
  { pub: { score: 0 }, players: [] }
];
pub.teams.push(teams[0].pub);
pub.teams.push(teams[1].pub);

export function addPlayer(socket: SocketIO.Socket) {
  new Player(socket);
}

let tickIntervalId = setInterval(tick, shared.tickInterval);

function tick() {
  const playerMoves: { [playerId: string]: Game.PlayerMove; } = {};

  // let ballMove: Game.BallMove;
  if (pub.match != null && pub.ball.playerId == null) shared.tickBall(pub.ball);

    /*ballMove = {
      x: pub.ball.x, y: pub.ball.y, z: pub.ball.z,
      vx: pub.ball.vx, vy: pub.ball.vy, vz: pub.ball.vz
    };*/

  for (const player of players.active) {
    const avatar = player.pub.avatar;
    playerMoves[player.pub.id] = {
      x: avatar.x,
      z: avatar.z,
      jump: avatar.jump,
      angleY: avatar.angleY,
      angleX: avatar.angleX,
      catching: avatar.catching
    };
  }

  const data: Game.TickData = { playerMoves/*, ballMove*/ };
  io.in("game").emit("tick", data);

  if (pub.match != null) match.tick();
}

import { io } from "./index";
import * as shared from "../shared";
import Player from "./Player";

interface Team { pub: Game.TeamPub; players: Player[]; }

export const pub: Game.GamePub = {
  match: null,
  players: [],
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

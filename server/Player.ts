import { io } from "./index";
import * as game from "./game";
import * as match from "./match";
import * as shared from "../shared";

export default class Player {
  pub: Game.PlayerPub;

  constructor(public socket: SocketIO.Socket) {
    this.pub = { id: socket.id, name: `Guest${Math.floor(1000 + Math.random() * 9000)}`, avatar: null };
    game.pub.players.push(this.pub);
    game.players.byId[this.pub.id] = this;
    game.players.all.push(this);

    io.in("game").emit("addPlayer", this.pub);
    this.socket.join("game");

    socket.on("chat", this.onChat);
    socket.on("setName", this.onSetName);
    socket.on("joinTeam", this.onJoinTeam);
    socket.on("input", this.onInput);
    socket.on("disconnect", this.onDisconnect);

    socket.emit("welcome", game.pub, this.pub.id);
  }

  private onChat = (text: string, callback: Game.ErrorCallback) => {
    if (typeof text !== "string" || text.length < 1 || text.length > 300) { callback("Invalid chat message."); return; }

    io.in("game").emit("chat", this.socket.id, text);
  };

  private onSetName = (name: string, callback: Game.ErrorCallback) => {
    if (typeof name !== "string" || name.length < 1 || name.length > 20) { callback("Invalid name."); return; }

    io.in("game").emit("setName", this.socket.id, name);
    this.pub.name = name;
    callback(null);
  };

  private onJoinTeam = (teamIndex: number, callback: Game.ErrorCallback) => {
    if (this.pub.avatar != null) { this.socket.disconnect(); return; }
    if (typeof teamIndex !== "number") { this.socket.disconnect(); return; }

    const team = game.teams[teamIndex];
    if (team == null) { this.socket.disconnect(); return; }
    if (team.players.length === shared.maxPlayersPerTeam) { callback("Team is full."); return; }

    // Setup avatar and team
    const x = teamIndex === 0 ? -5 : 5;
    const z = (team.players.length - 1) * 3;
    const angleY = teamIndex === 0 ? 0 : Math.PI;
    this.pub.avatar = { teamIndex, score: 0, x, z, jump: 0, angleX: 0, angleY };
    team.players.push(this);

    // Add to active players list
    game.players.active.push(this);

    // Add to room
    this.socket.join(`game:team:${teamIndex}`);

    // Let everyone know
    io.in("game").emit("joinTeam", this.socket.id, this.pub.avatar);

    // Launch match
    if (game.pub.match == null && game.players.active.length === shared.maxPlayersPerTeam * 2) {
      match.start();
    }

    callback(null);
  };

  private onInput = (move: Game.PlayerMove) => {
    const avatar = this.pub.avatar;
    if (avatar == null) { return; }

    if (game.pub.match != null) {
      avatar.x = move.x;
      avatar.z = move.z;
    }

    avatar.jump = move.jump;
    avatar.angleX = move.angleX;
    avatar.angleY = move.angleY;
  };

  private onDisconnect = () => {
    if (this.pub.avatar != null) {
      game.players.active.splice(game.players.active.indexOf(this), 1);

      const team = game.teams[this.pub.avatar.teamIndex];
      team.players.splice(team.players.indexOf(this), 1);
    }

    game.pub.players.splice(game.pub.players.indexOf(this.pub), 1);
    delete game.players.byId[this.pub.id];
    game.players.all.splice(game.players.all.indexOf(this), 1);

    io.in("game").emit("removePlayer", this.socket.id);

    if (game.pub.match != null && game.players.active.length === 1) {
      match.end();
    }
  };
}

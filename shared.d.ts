declare namespace Game {
  interface ErrorCallback { (err: string): void; }

  interface GamePub {
    match: Game.MatchPub;
    players: Game.PlayerPub[];
    teams: Game.TeamPub[];
  }

  interface PlayerPub {
    id: string;
    name: string;
    avatar?: AvatarPub;
  }

  interface AvatarPub {
    teamIndex: number;
    score: number;
    x: number;
    y: number;
    jump: number;
    angleX: number;
    angleY: number;
  }

  interface TeamPub {
    score: number;
  }

  interface MatchPub {
    ticksLeft: number;
  }
}

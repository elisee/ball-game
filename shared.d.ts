declare namespace Game {
  interface ErrorCallback { (err: string): void; }

  interface GamePub {
    match: MatchPub;
    ball: BallPub;
    players: PlayerPub[];
    teams: TeamPub[];
  }

  interface MatchPub {
    ticksLeft: number;
    scoreTimer: number;
  }

  interface BallPub {
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    playerId: string;
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
    z: number;
    jump: AvatarJump;
    angleX: number;
    angleY: number;
    catching: boolean;
  }

  interface AvatarJump {
    timer: number;
    withBall: boolean;
  }

  interface TeamPub {
    score: number;
  }


  interface TickData {
    playerMoves: { [playerId: string]: PlayerMove; };
    // ballMove?: BallMove;
  }

  interface PlayerMove {
    x: number;
    z: number;
    jump: AvatarJump;
    angleX: number;
    angleY: number;
    catching: boolean;
  }

  interface PlayerInput {
    x: number;
    z: number;
    jumping: boolean;
    angleX: number;
    angleY: number;
    catching?: boolean;
  }

  /*interface BallMove {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
  }*/
}

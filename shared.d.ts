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
    jump: number;
    angleX: number;
    angleY: number;
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
    jump: number;
    angleX: number;
    angleY: number;
  }

  interface PlayerInput {
    x: number;
    z: number;
    jump: boolean;
    angleX: number;
    angleY: number;

    throw?: boolean;
    catch?: boolean;
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

export const maxPlayersPerTeam = 3;
export const tickInterval = 1000 / 20;
export const matchDurationTicks = 20 * 60 * 5;

export const court = {
  width: 12,
  depth: 8,
  border: 1
};

export const shoulderY = 0.9;
export const armLength = 0.6;
export const resetBallDuration = 60;

export const jump = {
  duration: 15,
  boost: 0.3,
  gravity: 0.05
};

export const basket = {
  y: 3.75,
  width: 3,
  height: 1.5
};

export const ballPhysics = {
  radius: 0.3,
  catchRadius: 0.5,

  drag: 0.98,
  bounce: 0.6,
  gravity: 0.02
};


export function getArmPosition(avatar: Game.AvatarPub) {
  const x = avatar.x + Math.cos(avatar.angleY) * Math.cos(avatar.angleX) * armLength;
  const z = avatar.z + Math.sin(avatar.angleY) * Math.cos(avatar.angleX) * armLength;

  const y = (shoulderY + getAvatarY(avatar.jump) + Math.sin(avatar.angleX) * armLength);

  return { x, y, z };
}

export function getAvatarY(jumpTimer: number) {
  if (jumpTimer === 0) return 0;

  const n = jump.duration - jumpTimer;
  return Math.max(0, (jump.boost * n) - jump.gravity * (n - 1) * n / 2);
}

const ballXmin = -court.width / 2 - court.border + ballPhysics.radius;
const ballXmax = court.width / 2 + court.border - ballPhysics.radius;

const ballZmin = -court.depth / 2 - court.border + ballPhysics.radius;
const ballZmax = court.depth / 2 - court.border + ballPhysics.radius;

const basketYmin = basket.y - basket.height / 2;
const basketYmax = basket.y + basket.height / 2;
const basketZmin = -basket.width / 2;
const basketZmax = basket.width / 2;

export function tickBall(ball: Game.BallPub) {
  let hitBasketTeamIndex: number = null;

  ball.x += ball.vx;
  if (ball.x < ballXmin) {
    if (ball.y > basketYmin && ball.y < basketYmax &&
    ball.z > basketZmin && ball.z < basketZmax) {
      hitBasketTeamIndex = 1;
    }

    ball.x = ballXmin + (ballXmin - ball.x) * ballPhysics.bounce;
    ball.vx = -ball.vx * ballPhysics.bounce;
  } else if (ball.x > ballXmax) {
    if (ball.y > basketYmin && ball.y < basketYmax &&
    ball.z > basketZmin && ball.z < basketZmax) {
      hitBasketTeamIndex = 0;
    }

    ball.x = ballXmax + (ballXmax - ball.x) * ballPhysics.bounce;
    ball.vx = -ball.vx * ballPhysics.bounce;
  }

  ball.z += ball.vz;
  if (ball.z < ballZmin) {
    ball.z = ballZmin + (ballZmin - ball.z) * ballPhysics.bounce;
    ball.vz = -ball.vz * ballPhysics.bounce;
  } else if (ball.z > ballZmax) {
    ball.z = ballZmax + (ballZmax - ball.z) * ballPhysics.bounce;
    ball.vz = -ball.vz * ballPhysics.bounce;
  }

  ball.vx *= ballPhysics.drag;
  ball.vz *= ballPhysics.drag;

  if (ball.y !== ballPhysics.radius || ball.vy !== 0) {
    ball.y += ball.vy;
    ball.vy -= ballPhysics.gravity;

    if (ball.y < ballPhysics.radius) {
      if (ball.vy > -0.05) {
        ball.y = ballPhysics.radius;
        ball.vy = 0;
      } else {
        ball.y = ballPhysics.radius + (ballPhysics.radius - ball.y) * ballPhysics.bounce;
        ball.vy = -ball.vy * ballPhysics.bounce;
      }
    }
  }

  return hitBasketTeamIndex;
}

export function resetBall(ball: Game.BallPub) {
  ball.x = ball.z = 0;
  ball.y = 1;
  ball.vx = ball.vz = 0;
  ball.vy = 0.3;
  ball.playerId = null;
}

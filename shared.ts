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

export const jumpDuration = 10;
export const jumpBoost = 0.1;
export const gravity = 0.01;

export const ballPhysics = {
  radius: 0.3,
  catchRadius: 0.5,

  drag: 0.98,
  bounce: 0.8
};

export function getArmPosition(avatar: Game.AvatarPub) {
  const x = avatar.x + Math.cos(avatar.angleY) * Math.cos(avatar.angleX) * armLength;
  const z = avatar.z + Math.sin(avatar.angleY) * Math.cos(avatar.angleX) * armLength;

  const y = (shoulderY + getAvatarY(avatar.jump) + Math.sin(avatar.angleX) * armLength);

  return { x, y, z };
}

export function getAvatarY(jumpTimer: number) {
  if (jumpTimer === 0) return 0;

  const n = 1 + jumpDuration - jumpTimer;
  return Math.max(0, jumpBoost * (n - gravity * (n - 1) * n / 2));
}

const ballXmin = -court.width / 2 - court.border + ballPhysics.radius;
const ballXmax = court.width / 2 + court.border - ballPhysics.radius;

const ballZmin = -court.depth / 2 - court.border + ballPhysics.radius;
const ballZmax = court.depth / 2 - court.border + ballPhysics.radius;

export function tickBall(ball: Game.BallPub) {
  ball.x += ball.vx;
  if (ball.x < ballXmin) {
    ball.x = ballXmin + (ballXmin - ball.x) * ballPhysics.bounce;
    ball.vx = -ball.vx * ballPhysics.bounce;
  } else if (ball.x > ballXmax) {
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

  ball.y += ball.vy;
  ball.vy -= gravity;

  ball.y -= gravity;
  if (ball.y < ballPhysics.radius) {
    ball.y = ballPhysics.radius + (ballPhysics.radius - ball.y) * ballPhysics.bounce;
    ball.vy = -ball.vy * ballPhysics.bounce;
  }
}

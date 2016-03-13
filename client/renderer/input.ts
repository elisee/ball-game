let leftStickAngle: number = null;
let rightStickAngle: number = null;
let rightTrigger = 0;
let jumpPressed = false;
let shootPressed = false;

export let predictedMove: Game.PlayerMove;

export function gather() {
  const gamepad = navigator.getGamepads()[0];
  if (gamepad == null) return;

  const leftX = gamepad.axes[0];
  const leftY = gamepad.axes[1];
  if (Math.sqrt(leftX * leftX + leftY * leftY) > 0.35) {
    leftStickAngle = Math.atan2(leftY, leftX);
  } else {
    leftStickAngle = null;
  }

  const rightX = gamepad.axes[2];
  const rightY = gamepad.axes[3];
  if (Math.sqrt(rightX * rightX + rightY * rightY) > 0.35) {
    rightStickAngle = Math.atan2(rightY, rightX);
  } else {
    rightStickAngle = null;
  }

  rightTrigger = gamepad.buttons[7].value;
  jumpPressed = gamepad.buttons[0].pressed;
  shootPressed = gamepad.buttons[4].pressed;
}

export function initPrediction(avatar: Game.AvatarPub) {
  predictedMove = {
    x: avatar.x,
    z: avatar.z,
    jump: avatar.jump,
    angleY: avatar.angleY,
    angleX: avatar.angleX
  };
}

export function predict() {
  if (leftStickAngle != null) {
    predictedMove.x += Math.cos(leftStickAngle) * 0.1;
    predictedMove.z += Math.sin(leftStickAngle) * 0.1;
  }

  if (rightStickAngle != null) {
    predictedMove.angleY = rightStickAngle;
  }

  predictedMove.angleX = Math.PI / 4 * rightTrigger;
}

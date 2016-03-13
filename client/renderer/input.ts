import * as shared from "../../shared";

let leftStickAngle: number = null;
let rightStickAngle: number = null;
let rightTrigger = 0;
let jumpPressed = false;

let throwOrCatchPressed = false;
let hasJustPressedThrowOrCatch = false;

export let prediction: Game.PlayerInput;

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

  // Left trigger
  if (!throwOrCatchPressed && gamepad.buttons[6].pressed) hasJustPressedThrowOrCatch = true;
  throwOrCatchPressed = gamepad.buttons[6].pressed;
}

export function initPrediction(avatar: Game.AvatarPub) {
  prediction = {
    x: avatar.x,
    z: avatar.z,
    jump: false,
    angleY: avatar.angleY,
    angleX: avatar.angleX
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function predict(canMove: boolean, hasJustThrown: boolean) {
  if (canMove && leftStickAngle != null) {
    prediction.x = clamp(prediction.x + Math.cos(leftStickAngle) * 0.1, -shared.court.width / 2, shared.court.width / 2);
    prediction.z = clamp(prediction.z + Math.sin(leftStickAngle) * 0.1, -shared.court.depth / 2, shared.court.depth / 2);
  }

  if (rightStickAngle != null) {
    prediction.angleY = rightStickAngle;
  }

  prediction.angleX = Math.PI / 4 * rightTrigger;

  prediction.jump = jumpPressed;

  prediction.throw = hasJustPressedThrowOrCatch ? true : undefined;
  hasJustPressedThrowOrCatch = false;

  prediction.catch = (throwOrCatchPressed && !hasJustThrown) ? true : undefined;
}

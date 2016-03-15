import * as shared from "../../shared";
import { canvas } from "./index";

canvas.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
document.querySelector(".main").addEventListener("click", onClick);

let leftStickAngle: number = null;
let rightStickAngle: number = null;
let rightTrigger = 0;
let jumpPressed = false;

let wasLeftTriggerDown = false;
let isLeftTriggerDown = false;
export let hasJustPressedLeftTrigger = false;

export let prediction: Game.PlayerInput;

export function gather() {
  const gamepads = navigator.getGamepads();

  let hasFoundGamepad = false;

  for (const gamepad of gamepads) {
    if (gamepad == null) continue;
    if (gamepad.axes.length < 2) continue;
    if (gamepad.buttons.length < 8) continue;
    gatherGamepad(gamepad);
    hasFoundGamepad = true;
    break;
  }

  if (!hasFoundGamepad) gatherKeyboard();
}

function gatherGamepad(gamepad: Gamepad) {
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

  rightTrigger = gamepad.buttons[7].value > 0.1 ? gamepad.buttons[7].value : 0;
  jumpPressed = gamepad.buttons[4].pressed /* LB */ || gamepad.buttons[5].pressed /* RB */;

  wasLeftTriggerDown = isLeftTriggerDown;
  isLeftTriggerDown = gamepad.buttons[6].pressed;
  hasJustPressedLeftTrigger = !wasLeftTriggerDown && isLeftTriggerDown;
}

const keys: { [keyCode: number]: boolean; } = {};

function onKeyDown(event: KeyboardEvent) {
  keys[event.keyCode] = true;
  console.log(event.keyCode);
}

function onKeyUp(event: KeyboardEvent) {
  keys[event.keyCode] = false;
}

function onClick(event: MouseEvent) {
  if (event.button !== 0) return;

  canvas.focus();
}

function gatherKeyboard() {
  leftStickAngle = null;

  const leftKey = keys[37];
  const upKey = keys[38];
  const rightKey = keys[39];
  const downKey = keys[40];

  if (leftKey) {
    if (upKey) {
      leftStickAngle = -Math.PI * 3 / 4;
    } else if (downKey) {
      leftStickAngle = Math.PI * 3 / 4;
    } else {
      leftStickAngle = Math.PI;
    }
  } else if (rightKey) {
    if (upKey) {
      leftStickAngle = -Math.PI / 4;
    } else if (downKey) {
      leftStickAngle = Math.PI / 4;
    } else {
      leftStickAngle = 0;
    }
  } else if (downKey) {
    leftStickAngle = Math.PI / 2;
  } else if (upKey) {
    leftStickAngle = -Math.PI / 2;
  }

  rightStickAngle = leftStickAngle;

  rightTrigger = keys[17] /* Ctrl */ ? 0.5 : (keys[16] ? 1 : 0);
  jumpPressed = keys[32] /* Space */;

  wasLeftTriggerDown = isLeftTriggerDown;
  isLeftTriggerDown = keys[88] /* X */;
  hasJustPressedLeftTrigger = !wasLeftTriggerDown && isLeftTriggerDown;
}

export function initPrediction(avatar: Game.AvatarPub) {
  prediction = {
    x: avatar.x,
    z: avatar.z,
    jumping: false,
    angleY: avatar.angleY,
    angleX: avatar.angleX
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function predict(matchStarted: boolean, hasBall: boolean, throwCooldown: boolean) {
  if (matchStarted && !hasBall && leftStickAngle != null) {
    prediction.x = clamp(prediction.x + Math.cos(leftStickAngle) * 0.1, -shared.court.width / 2, shared.court.width / 2);
    prediction.z = clamp(prediction.z + Math.sin(leftStickAngle) * 0.1, -shared.court.depth / 2, shared.court.depth / 2);
  }

  if (rightStickAngle != null) {
    prediction.angleY = rightStickAngle;
  }

  prediction.angleX = Math.PI / 3 * rightTrigger;

  prediction.jumping = jumpPressed;
  prediction.catching = rightTrigger > 0 && !hasBall && !throwCooldown ? true : undefined;
}

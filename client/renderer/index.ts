import * as THREE from "three";
THREE.Euler.DefaultOrder = "YXZ";

import camera from "./camera";
import * as court from "./court";
import ball from "./ball";
import * as character from "./character";

import * as input from "./input";
import { myPlayerId } from "../gameClient";

const playersById: { [playerId: string]: character.Model; } = {};

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;

const threeRenderer = new THREE.WebGLRenderer({ canvas });
threeRenderer.shadowMap.enabled = true;
threeRenderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.add(court.root);
scene.add(ball);

let animationId: number;

export function start() {
  animationId = requestAnimationFrame(animate);
}

export function stop() {
  cancelAnimationFrame(animationId);
  animationId = null;
}

export function addPlayer(player: Game.PlayerPub) {
  const model = character.make(player.avatar);
  court.root.add(model.root);
  playersById[player.id] = model;

  if (player.id === myPlayerId) {
    input.initPrediction(player.avatar);
  }
}

export function removePlayer(playerId: string) {
  const model = playersById[playerId];
  model.root.parent.remove(model.root);

  delete playersById[playerId];
}

function animate() {
  animationId = requestAnimationFrame(animate);

  let width = canvas.parentElement.clientWidth;
  let height = canvas.parentElement.clientHeight;
  if (width > height * 4 / 3) width = height * 4 / 3;
  if (height > width * 3 / 4) height = width * 3 / 4;

  canvas.width = width;
  canvas.height = height;

  camera.updateProjectionMatrix();

  threeRenderer.setSize(canvas.width, canvas.height, false);
  threeRenderer.render(scene, camera);

  const myModel = playersById[myPlayerId];
  if (myModel != null) {
    input.gather();

    // TODO: Use proper ticking mechanism
    input.predict();

    myModel.root.position.set(input.predicted.x, 0, input.predicted.z);
    myModel.root.setRotationFromEuler(new THREE.Euler(0, -input.predicted.angleY, 0));
  }
}

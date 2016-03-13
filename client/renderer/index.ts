import * as THREE from "three";
THREE.Euler.DefaultOrder = "YXZ";

import camera from "./camera";
import * as court from "./court";
import ball from "./ball";
import * as character from "./character";

import * as input from "./input";
import { myPlayerId, players } from "../gameClient";

const modelsById: { [playerId: string]: character.Model; } = {};

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
  modelsById[player.id] = model;

  if (player.id === myPlayerId) {
    input.initPrediction(player.avatar);
  }
}

export function removePlayer(playerId: string) {
  const model = modelsById[playerId];
  model.root.parent.remove(model.root);

  delete modelsById[playerId];
}

export function reset() {
  for (const playerId in modelsById) removePlayer(playerId);

  // TODO: Reset ball
}

const tmpEuler = new THREE.Euler();

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

  input.gather();

  for (const playerId in modelsById) {
    const model = modelsById[playerId];
    const { avatar } = players.byId[playerId];

    if (playerId === myPlayerId) {
      // TODO: Use proper ticking mechanism
      input.predict();
      model.root.position.set(input.predictedMove.x, 0, input.predictedMove.z);
      model.root.setRotationFromEuler(tmpEuler.set(0, -input.predictedMove.angleY, 0));
      model.shoulders.setRotationFromEuler(tmpEuler.set(0, 0, input.predictedMove.angleX));
    } else {
      // TODO: Lerp between previous and current!
      model.root.position.set(avatar.x, 0, avatar.z);
      model.root.setRotationFromEuler(tmpEuler.set(0, -avatar.angleY, 0));
      model.shoulders.setRotationFromEuler(tmpEuler.set(0, 0, avatar.angleX));
    }
  }
}

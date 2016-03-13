import * as THREE from "three";
THREE.Euler.DefaultOrder = "YXZ";

import camera from "./camera";
import * as court from "./court";
import ball from "./ball";
import * as character from "./character";

const playersById: { [playerId: string]: THREE.Mesh; } = {};

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const threeRenderer = new THREE.WebGLRenderer({ canvas });
threeRenderer.shadowMap.enabled = true;
threeRenderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.add(court.root);
scene.add(ball);

let animationId: number;

export function start() {
  animationId = requestAnimationFrame(render);
}

export function stop() {
  cancelAnimationFrame(animationId);
  animationId = null;
}

export function addPlayer(player: Game.PlayerPub) {
  const mesh = character.make(player.avatar);
  court.root.add(mesh);
  playersById[player.id] = mesh;
}

export function removePlayer(playerId: string) {
  const character = playersById[playerId];
  character.parent.remove(character);

  delete playersById[playerId];
}

function render() {
  animationId = requestAnimationFrame(render);

  let width = canvas.parentElement.clientWidth;
  let height = canvas.parentElement.clientHeight;
  if (width > height * 4 / 3) width = height * 4 / 3;
  if (height > width * 3 / 4) height = width * 3 / 4;

  canvas.width = width;
  canvas.height = height;

  camera.updateProjectionMatrix();

  threeRenderer.setSize(canvas.width, canvas.height, false);
  threeRenderer.render(scene, camera);
}

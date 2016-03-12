import * as THREE from "three";


const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.z = 10;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
scene.add(cube);

let animationId: number;

export function start() {
  animationId = requestAnimationFrame(render);
}

export function stop() {
  cancelAnimationFrame(animationId);
  animationId = null;
}

export function addPlayer(player: Game.PlayerPub) {
  // NOTHING
}

export function removePlayer(playerId: string) {
  // NOTHING
}

export function setPlayerAvatar(playerId: string, avatar: Game.AvatarPub) {
  // NOTHING
}

function render() {
  animationId = requestAnimationFrame(render);

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();

  renderer.setSize(canvas.width, canvas.height, false);
  renderer.render(scene, camera);
}

import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(30, 4 / 3, 0.1, 100);
camera.position.z = 25;
camera.position.y = 12;
camera.setRotationFromEuler(new THREE.Euler(-Math.PI / 8, 0, 0));

export default camera;

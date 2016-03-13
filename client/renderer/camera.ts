import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(50, 4 / 3, 0.1, 100);
camera.position.z = 16;
camera.position.y = 8.5;
camera.setRotationFromEuler(new THREE.Euler(-Math.PI / 8, 0, 0));

export default camera;

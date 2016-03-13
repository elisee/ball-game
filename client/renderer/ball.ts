import * as THREE from "three";

const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xd65628, roughness: 0.8, metalness: 0.3 });

const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(0.4), ballMaterial);
ball.castShadow = true;
ball.receiveShadow = true;
ball.position.y = 1;

export default ball;

import * as THREE from "three";
import * as shared from "../../shared";

const ballMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xd65628, roughness: 0.8, metalness: 0.3 });

const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(shared.ballPhysics.radius), ballMaterial);
ball.castShadow = true;
ball.receiveShadow = true;
ball.position.y = 1;

export default ball;

import * as THREE from "three";

export interface Model {
  root: THREE.Group;
  // body: THREE.Mesh;
  head: THREE.Mesh;
  shoulders: THREE.Group;
}

const headMaterial = new THREE.MeshStandardMaterial({ color: 0xff8888, roughness: 0.8, metalness: 0.3 });
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xcc8888, roughness: 0.8, metalness: 0.3 });

const teamMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.8, metalness: 0.3 }),
  new THREE.MeshStandardMaterial({ color: 0x4444ff, roughness: 0.8, metalness: 0.3 }),
];

export function make(avatar: Game.AvatarPub): Model {
  const root = new THREE.Group();
  root.rotateY(avatar.angleY);
  root.position.x = avatar.x;
  root.position.z = avatar.z;

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.5), teamMaterials[avatar.teamIndex]);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = 0.7;
  root.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), headMaterial);
  head.castShadow = true;
  head.receiveShadow = true;
  head.position.y = 0.5;
  body.add(head);

  const shoulders = new THREE.Group();
  shoulders.position.y = 0.2;
  shoulders.rotateX(avatar.angleX);
  body.add(shoulders);

  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), skinMaterial);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  leftArm.position.x = 0.3;
  leftArm.position.z = 0.3;
  shoulders.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), skinMaterial);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  rightArm.position.x = 0.3;
  rightArm.position.z = -0.3;
  shoulders.add(rightArm);

  const pelvis = new THREE.Group();
  pelvis.position.y = -0.1;
  body.add(pelvis);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), skinMaterial);
  leftLeg.castShadow = true;
  leftLeg.receiveShadow = true;
  leftLeg.position.y = -0.3;
  leftLeg.position.z = 0.1;
  pelvis.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), skinMaterial);
  rightLeg.castShadow = true;
  rightLeg.receiveShadow = true;
  rightLeg.position.y = -0.3;
  rightLeg.position.z = -0.1;
  pelvis.add(rightLeg);

  return { root, head, shoulders };
}

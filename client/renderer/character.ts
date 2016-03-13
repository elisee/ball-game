import * as THREE from "three";

const teamMaterials = [
  {
    body: new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.8, metalness: 0.3 }),
  },
  {
    body: new THREE.MeshStandardMaterial({ color: 0x4444ff, roughness: 0.8, metalness: 0.3 }),
  }
];

export function make(avatar: Game.AvatarPub) {
  const character = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), teamMaterials[avatar.teamIndex].body);
  character.castShadow = true;
  character.receiveShadow = true;
  character.position.x = avatar.x;
  character.position.y = 0.5;
  character.position.z = avatar.z;
  character.rotateY(avatar.angleY);

  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), teamMaterials[avatar.teamIndex].body);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  leftArm.position.x = 0.3;
  leftArm.position.z = 0.3;
  leftArm.rotateX(avatar.angleX);
  character.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), teamMaterials[avatar.teamIndex].body);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  rightArm.position.x = 0.3;
  rightArm.position.z = -0.3;
  rightArm.rotateX(avatar.angleX);
  character.add(rightArm);

  return character;
}

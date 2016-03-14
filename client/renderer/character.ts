import * as THREE from "three";

export interface Model {
  root: THREE.Group;
  nametag: THREE.Mesh;
  nametagCtx: CanvasRenderingContext2D;
  body: THREE.Mesh;
  head: THREE.Mesh;
  shoulders: THREE.Group;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
}

const headMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xff8888, roughness: 0.8, metalness: 0.3 });
const skinMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xcc8888, roughness: 0.8, metalness: 0.3 });

const teamMaterials = [
  new (THREE as any).MeshStandardMaterial({ color: 0xff4444, roughness: 0.8, metalness: 0.3 }),
  new (THREE as any).MeshStandardMaterial({ color: 0x4444ff, roughness: 0.8, metalness: 0.3 }),
];

const nametagGeometry = new THREE.PlaneGeometry(1, 0.5);
const bodyGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.5);
const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const armGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.2);
armGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.3, 0, 0));
const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
legGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.3, 0));

export function makeModel(avatar: Game.AvatarPub, name: string): Model {
  const root = new THREE.Group();
  root.position.x = avatar.x;
  root.position.z = avatar.z;

  const nametagCanvas = document.createElement("canvas");
  nametagCanvas.width = 256;
  nametagCanvas.height = 128;
  const nametagCtx = nametagCanvas.getContext("2d");

  const nametagTexture = new THREE.Texture(nametagCanvas, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearFilter);
  const nametag = new THREE.Mesh(nametagGeometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5, map: nametagTexture }));
  nametag.position.y = 1.8;
  root.add(nametag);

  const body = new THREE.Mesh(bodyGeometry, teamMaterials[avatar.teamIndex]);
  body.rotateY(avatar.angleY);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = 0.7;
  root.add(body);

  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.castShadow = true;
  head.receiveShadow = true;
  head.position.y = 0.5;
  body.add(head);

  const shoulders = new THREE.Group();
  // NOTE: Global Y must match up with shared.shoulderHeight
  shoulders.position.y = 0.2;
  shoulders.rotateX(avatar.angleX);
  body.add(shoulders);

  // NOTE: Arm length must match up with shared.armLength
  const leftArm = new THREE.Mesh(armGeometry, skinMaterial);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  leftArm.position.z = 0.3;
  shoulders.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, skinMaterial);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  rightArm.position.z = -0.3;
  shoulders.add(rightArm);

  const pelvis = new THREE.Group();
  pelvis.position.y = -0.1;
  body.add(pelvis);

  const leftLeg = new THREE.Mesh(legGeometry, skinMaterial);
  leftLeg.castShadow = true;
  leftLeg.receiveShadow = true;
  leftLeg.position.z = 0.1;
  pelvis.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, skinMaterial);
  rightLeg.castShadow = true;
  rightLeg.receiveShadow = true;
  rightLeg.position.z = -0.1;
  pelvis.add(rightLeg);

  const model = { root, nametag, nametagCtx, body, head, shoulders, leftArm, rightArm, leftLeg, rightLeg };
  updateNametag(model, name);

  return model;
}

export function updateNametag(model: Model, name: string) {
  name = name.toUpperCase();

  const ctx = model.nametagCtx;
  ctx.font = "48px sans-serif";
  ctx.canvas.width = ctx.measureText(name).width + 64;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(name.toUpperCase(), ctx.canvas.width / 2, ctx.canvas.height / 2);
  (model.nametag.material as THREE.MeshBasicMaterial).map.needsUpdate = true;

  model.nametag.scale.set(ctx.canvas.width / 256, 1, 1);
}

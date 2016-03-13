import * as THREE from "three";

export const root = new THREE.Group();

const floorImage = new Image();
floorImage.src = "floor.png";
floorImage.addEventListener("load", () => { floorTexture.needsUpdate = true; });
const floorTexture = new THREE.Texture(floorImage, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter);

const wallImage = new Image();
wallImage.src = "wall.png";
wallImage.addEventListener("load", () => { wallTexture.needsUpdate = true; });
const wallTexture = new THREE.Texture(wallImage, null, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.3, map: floorTexture });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.3, map: wallTexture });
const cageMaterial = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.8, metalness: 0.2 });

const ambientLight = new THREE.AmbientLight(0xcccccc);
root.add(ambientLight);

const spotLight1 = new THREE.PointLight(0xffffff, 0.5);
spotLight1.position.x = 4;
spotLight1.position.y = 6;
spotLight1.position.z = -2;
root.add(spotLight1);

const spotLight2 = new THREE.PointLight(0xffffff, 0.5);
spotLight2.position.x = -4;
spotLight2.position.y = 6;
spotLight2.position.z = -2;
root.add(spotLight2);

const spotLight3 = new THREE.PointLight(0xffffff, 0.2);
spotLight3.castShadow = true;
spotLight3.shadow.mapSize.set(1024, 1024);
spotLight3.position.x = 0;
spotLight3.position.y = 6;
spotLight3.position.z = 2;
root.add(spotLight3);

const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(14, 10), floorMaterial);
floor.receiveShadow = true;
floor.rotateX(-Math.PI / 2);
root.add(floor);

const backWall = new THREE.Mesh(new THREE.PlaneBufferGeometry(14, 5), wallMaterial);
(backWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(1, 2.8);
(backWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(3, 2.8);
backWall.receiveShadow = true;
backWall.position.y = 2.5;
backWall.position.z = -5;
root.add(backWall);

const frontWall = new THREE.Mesh(new THREE.PlaneBufferGeometry(14, 5), wallMaterial);
(frontWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(1, 2.8);
(frontWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(3, 2.8);
frontWall.receiveShadow = true;
frontWall.rotateY(Math.PI);
frontWall.position.y = 2.5;
frontWall.position.z = 5;
root.add(frontWall);

const leftWall = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 5), wallMaterial);
leftWall.receiveShadow = true;
leftWall.rotateY(Math.PI / 2);
leftWall.position.y = 2.5;
leftWall.position.x = -7;
root.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 5), wallMaterial);
rightWall.receiveShadow = true;
rightWall.rotateY(-Math.PI / 2);
rightWall.position.y = 2.5;
rightWall.position.x = 7;
root.add(rightWall);

const leftBasket = new THREE.Mesh(new THREE.PlaneBufferGeometry(3, 1.5), cageMaterial);
leftBasket.receiveShadow = true;
leftBasket.rotateY(Math.PI / 2);
leftBasket.position.y = 2;
leftBasket.position.x = -6.99;
root.add(leftBasket);

const rightBasket = new THREE.Mesh(new THREE.PlaneBufferGeometry(3, 1.5), cageMaterial);
rightBasket.receiveShadow = true;
rightBasket.rotateY(-Math.PI / 2);
rightBasket.position.y = 2;
rightBasket.position.x = 6.99;
root.add(rightBasket);

import * as THREE from "three";
import * as shared from "../../shared";
import loadTexture from "./loadTexture";

export const root = new THREE.Group();

const floorTexture = loadTexture("textures/floor.png", false);
const wallTexture = loadTexture("textures/wall.png", true);
const redBasketTexture = loadTexture("textures/red-basket.png", true);
const blueBasketTexture = loadTexture("textures/blue-basket.png", true);

const floorMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.3, map: floorTexture });
const wallMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.3, map: wallTexture });

const redBasketMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.2, map: redBasketTexture });
const blueBasketMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.2, map: blueBasketTexture });

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

const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(shared.court.width + shared.court.border * 2, shared.court.depth + shared.court.border * 2), floorMaterial);
floor.receiveShadow = true;
floor.rotateX(-Math.PI / 2);
root.add(floor);

const largerWallGeometry = new THREE.PlaneBufferGeometry(shared.court.width + shared.court.border * 2, 5);
const smallerWallGeometry = new THREE.PlaneBufferGeometry(shared.court.depth + shared.court.border * 2, 5);

const backWall = new THREE.Mesh(largerWallGeometry, wallMaterial);
(backWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(1, 2.8);
(backWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(3, 2.8);
backWall.receiveShadow = true;
backWall.position.y = 2.5;
backWall.position.z = -5;
root.add(backWall);

const frontWall = new THREE.Mesh(largerWallGeometry, wallMaterial);
(frontWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(1, 2.8);
(frontWall.geometry as THREE.BufferGeometry).getAttribute("uv").setX(3, 2.8);
frontWall.receiveShadow = true;
frontWall.rotateY(Math.PI);
frontWall.position.y = 2.5;
frontWall.position.z = 5;
root.add(frontWall);

const leftWall = new THREE.Mesh(smallerWallGeometry, wallMaterial);
leftWall.receiveShadow = true;
leftWall.rotateY(Math.PI / 2);
leftWall.position.y = 2.5;
leftWall.position.x = -7;
root.add(leftWall);

const rightWall = new THREE.Mesh(smallerWallGeometry, wallMaterial);
rightWall.receiveShadow = true;
rightWall.rotateY(-Math.PI / 2);
rightWall.position.y = 2.5;
rightWall.position.x = 7;
root.add(rightWall);

const basketGeometry = new THREE.PlaneBufferGeometry(shared.basket.width, shared.basket.height);

export const redBasket = new THREE.Mesh(basketGeometry, redBasketMaterial);
redBasket.receiveShadow = true;
redBasket.rotateY(Math.PI / 2);
redBasket.position.y = shared.basket.y;
redBasket.position.x = -6.99;
root.add(redBasket);

export const blueBasket = new THREE.Mesh(basketGeometry, blueBasketMaterial);
blueBasket.receiveShadow = true;
blueBasket.rotateY(-Math.PI / 2);
blueBasket.position.y = shared.basket.y;
blueBasket.position.x = 6.99;
root.add(blueBasket);

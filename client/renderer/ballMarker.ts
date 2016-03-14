import * as THREE from "three";
import * as shared from "../../shared";
import loadTexture from "./loadTexture";

const markerTexture = loadTexture("textures/ball-marker.png", false);

const markerMaterial = new (THREE as any).MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.3, map: markerTexture, transparent: true });

const marker = new THREE.Mesh(new THREE.PlaneGeometry(shared.ballPhysics.radius * 2, shared.ballPhysics.radius * 2), markerMaterial);
marker.setRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
marker.castShadow = true;
marker.receiveShadow = true;
marker.position.y = 1;

export default marker;

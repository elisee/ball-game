import * as THREE from "three";

export default function loadTexture(path: string, repeat: boolean) {
  const image = new Image();
  image.src = path;
  image.addEventListener("load", () => { texture.needsUpdate = true; });
  const texture = new THREE.Texture(image, null, repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping, repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearFilter);
  return texture;
}

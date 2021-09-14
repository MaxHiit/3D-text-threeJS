import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { TextGeometry } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const params = {
  bgColor: "#fff"
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(params.bgColor);

gui.addColor(params, "bgColor").onChange(() => {
  scene.background.set(params.bgColor);
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/10.jpg");

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/gentilis_regular.typeface.json", (font) => {
  // text object
  const textGeometry = new THREE.TextBufferGeometry("MaxCode\nCreative\nDeveloper", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  // simple way for center text
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  // text mesh
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  // camera.lookAt(text.position);

  // torus object
  // new color() = new THREE.Color();
  const objectMaterial = new THREE.MeshBasicMaterial({ color: 0x000 });

  const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  // cube object
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

  // color for cube and torus
  const blueColor = "blue";
  const orangeColor = "orange";

  // loop that allows you to create several objects
  for (let i = 0; i < 100; i++) {
    const objectGeometry = i % 2 === 1 ? torusGeometry : cubeGeometry;
    const color = i % 2 === 1 ? blueColor : orangeColor;

    objectMaterial.color.set(color);

    const meshObject = new THREE.Mesh(objectGeometry, objectMaterial);

    // random position for each object
    meshObject.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 20
    );

    // random rotation for each object
    meshObject.rotation.x = Math.random() * Math.PI;
    meshObject.rotation.y = Math.random() * Math.PI;

    // random scale for each object
    // const scale = Math.random();
    const scale = 1;
    meshObject.scale.set(scale, scale, scale);

    // adding objects to the scene
    scene.add(meshObject);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

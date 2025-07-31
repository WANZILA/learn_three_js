// This code creates a grid of labeled 3D shapes using Three.js
// It draws shapes like cubes, spheres, cones, etc., and labels them with 3D text

// 📦 Load the main 3D engine (Three.js)
import * as THREE from 'three';

// 🔤 Load tools for creating 3D text
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// 🔄 Load tool for generating advanced shapes (like a Klein bottle)
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

// Global font variable to store the loaded font later
let font = null;

// 🎯 Load the font file from a URL
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', loadedFont => {
  font = loadedFont;
  main(); // Start the scene only after the font is ready
});

function main() {
  // 🎨 Select the HTML canvas we want to draw into
  const canvas = document.querySelector('#c');

  // 🖌️ Create the tool that will draw the 3D content onto the canvas
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 🎥 Create a camera (like a viewer's eyes in 3D space)
  const fov = 50;         // Field of view (how wide the view is)
  const aspect = 2;       // Width divided by height of the canvas
  const near = 0.1;       // How close objects can be and still be seen
  const far = 1000;       // How far away objects can be and still be seen
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 80; // Pull the camera back to see everything

  // 📐 Adjust camera when browser window is resized
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 🌍 Create the scene that will hold all our 3D objects
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA); // Set light gray background

  // 💡 Add lights so we can see the shapes clearly
  {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(-1, 2, 4); // direction the light is coming from
    scene.add(light);
  }
  {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(1, -2, -4); // second light for contrast
    scene.add(light);
  }

  // 🧺 A list to store all 3D shape objects for animation later
  const objects = [];

  // 📏 Controls spacing between shapes
  const xSpread = 15;  // Horizontal spacing between shapes
  const ySpread = 22;  // Vertical spacing between shapes

  // ➕ Helper function to add a shape at grid position (x, y)
  function addObject(x, y, obj) {
    obj.position.x = x * xSpread; // multiply by spacing to spread apart
    obj.position.y = y * ySpread;
    scene.add(obj);
    objects.push(obj);
  }

  // 🎨 Make a colorful material for each shape
  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    const hue = Math.random();
    material.color.setHSL(hue, 1, 0.5); // random color using HSL model
    return material;
  }

  // 🔧 Add a shape to the scene, and place a 3D label on it
  function addSolidGeometry(x, y, geometry, labelText = '') {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);

    if (labelText && font) {
      // Create the 3D text label
      const labelGeo = new TextGeometry(labelText, {
        font: font,
        size: 2,     // how large the letters are
        height: 0.1  // how thick the letters are
      });

      const labelMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);

      // Center the text based on its size
      labelGeo.computeBoundingBox();
      labelGeo.boundingBox.getCenter(labelMesh.position).multiplyScalar(-1);

      // Lift label above the shape
      labelMesh.position.y = 8;
      labelMesh.lookAt(camera.position); // turn label toward the camera

      const labelParent = new THREE.Object3D();
      labelParent.add(labelMesh);
      labelParent.position.set(x * xSpread, y * ySpread, 2); // 3D position of label
      scene.add(labelParent);
    }
  }

  // 🧪 A complex math-based shape (Klein bottle)
  function klein(v, u, target) {
    // u, v go from 0 to 1 and are scaled into angles
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;

    let x, z;
    if (u < Math.PI) {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
      z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }

    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    target.set(x, y, z).multiplyScalar(0.75); // shrink the shape
  }

  // 🧱 Define a list of 3D shapes to show
  const shapeList = [
    ['Box',         new THREE.BoxGeometry(8, 8, 8)],
    ['Circle',      new THREE.CircleGeometry(7, 24)],
    ['Cone',        new THREE.ConeGeometry(6, 8, 16)],
    ['Cylinder',    new THREE.CylinderGeometry(4, 4, 8, 12)],
    ['Dodeca',      new THREE.DodecahedronGeometry(7)],
    ['Icosa',       new THREE.IcosahedronGeometry(7)],
    ['Octa',        new THREE.OctahedronGeometry(7)],
    ['Sphere',      new THREE.SphereGeometry(7, 12, 8)],
    ['Tetra',       new THREE.TetrahedronGeometry(7)],
    ['Torus',       new THREE.TorusGeometry(5, 2, 8, 24)],
    ['Klein',       new ParametricGeometry(klein, 25, 25)],
  ];

  // 📊 Arrange shapes in rows and columns
  const columns = 6; // how many shapes per row
  const totalRows = Math.ceil(shapeList.length / columns); // total needed

  shapeList.forEach((entry, index) => {
    const col = index % columns; // which column it's in
    const row = Math.floor(index / columns); // which row it's in
    const x = col - Math.floor(columns / 2); // center horizontally
    const y = Math.floor(totalRows / 2) - row; // center vertically
    const [label, geometry] = entry;
    addSolidGeometry(x, y, geometry, label);
  });

  // 🔁 Adjusts renderer size if the screen size changes
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // 🎞️ Animation loop — rotates the shapes and redraws the screen
  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Spin each shape at its own speed
    objects.forEach((obj, ndx) => {
      const speed = 0.1 + ndx * 0.05;
      const rot = time * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    renderer.render(scene, camera); // draw the scene
    requestAnimationFrame(render);  // loop forever
  }

  // ▶️ Start the animation loop
  requestAnimationFrame(render);
}

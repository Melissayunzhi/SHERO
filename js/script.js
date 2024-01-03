// Define variables
let scene, camera, renderer, controls, model;

// Initialization and animation function calls
init();
animate();

let isHovering = false;

const modelContainer = document.getElementById('model-container');

modelContainer.addEventListener('mouseenter', function() {
    isHovering = true;
});

modelContainer.addEventListener('mouseleave', function() {
    isHovering = false;
});

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#052240");


  // Camera
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 800);
  camera.position.set(5, 5, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('model-container').appendChild(renderer.domElement);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.3;
  controls.zoomSpeed = 0.9;
  controls.minDistance = 3;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI / 2; // radians
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Ambient Light
  let ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  // GLTF Loader to load the .glb model
  let loader = new THREE.GLTFLoader();
  loader.load('models/test-compressed.glb', function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1.5, 1.5, 1.5); // Scale up the model as needed
    scene.add(model);

    // Adjust the camera to focus on the top of the model
    adjustCameraFocus(model);
});

function adjustCameraFocus(model) {
    // Calculate the bounding box of the model
    let bbox = new THREE.Box3().setFromObject(model);
    let modelHeight = bbox.max.y - bbox.min.y;

    // Position the camera slightly above and in front of the top of the model
    camera.position.set(0, bbox.max.y + modelHeight * 0.5, modelHeight);

    // Focus the camera on the upper part of the model
    // Adjust the Y offset as needed to target the top of the model
    let focusPoint = new THREE.Vector3(0, bbox.max.y - modelHeight * 0.2, 0);
    camera.lookAt(focusPoint);

    // Update the camera
    camera.updateProjectionMatrix();
}


  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function onMouseMove(event) {
    if (isHovering && model) {
        const mousePos = getRelativeMousePos(event);

        // Map the mouse position to a rotation range
        // Assuming you want a max rotation of Math.PI / 4 (45 degrees) in either direction
        const maxRotation = Math.PI / 4;
        model.rotation.y = mousePos.x * maxRotation;
    }
}

function getRelativeMousePos(event) {
    const bounds = modelContainer.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2; // Mouse x relative to the container center
    const y = event.clientY - bounds.top - bounds.height / 2; // Mouse y relative to the container center

    // Normalize the coordinates to a range of -0.5 to 0.5
    return {
        x: x / bounds.width,
        y: y / bounds.height
    };
}


document.addEventListener('mousemove', onMouseMove, false);
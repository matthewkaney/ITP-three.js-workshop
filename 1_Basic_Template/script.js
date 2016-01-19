// You'll always need one of each of these
var renderer, scene, camera;

// Our init function
window.onload = function() {
  // Create WebGL Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  var fov = 45; // field of view
  var aspectRatio = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  
  // All of our setup stuff goes here: /////////////
  
  
  //////////////////////////////////////////////////
  
  requestAnimationFrame(animate);
}

// Our looping function
function animate(timestamp) {
  // Do some stuff here
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
// These are the basics
var renderer, scene, camera;

// These are for our specific scene
var cameraRig;
var firelight, flame, sparks;

// Our init function
window.onload = function() {
  // Create WebGL Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera and rig
  var fov = 45; // field of view
  var aspectRatio = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  
  cameraRig = new THREE.Object3D();
  
  camera.position.z = 5;
  camera.position.y = 1;
  
  scene.add(cameraRig);
  cameraRig.add(camera);
  
  // Create a basic material
  var tempMaterial = new THREE.MeshPhongMaterial({color: 'white', shininess: 0});
  
  // Create our ground object
  var groundGeometry = new THREE.PlaneGeometry(20, 20);
  var groundMaterial = new THREE.MeshPhongMaterial({shininess: 0});
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  
  // Now, load our ground textures
  var texLoader = new THREE.TextureLoader();

  texLoader.load('assets/groundTexture.jpg', function ( texture ) {
  	groundMaterial.map = texture;
    groundMaterial.needsUpdate = true;
  });
  
  texLoader.load('assets/groundBump.jpg', function ( texture ) {
  	groundMaterial.bumpMap = texture;
    groundMaterial.bumpScale = 0.2;
    groundMaterial.needsUpdate = true;
  });
  
  // Create a ring of logs
  var logGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8);
  
  var numLogs = 5;
  var campfireRadius = 0.6;
  for(var i = 0; i < numLogs; ++i) {
    var log = new THREE.Mesh(logGeometry, tempMaterial);
    
    log.position.x = campfireRadius * Math.sin(i / numLogs * 2 * Math.PI);
    log.position.z = campfireRadius * Math.cos(i / numLogs * 2 * Math.PI);
    log.position.y = 0.3;
    
    log.rotation.order = 'YXZ';
    log.rotation.y = i / numLogs * 2 * Math.PI;
    log.rotation.x = -1.2 + 0.2 * Math.random();
    
    scene.add(log);
  }
  
  // Create our geometry loader
  var geometryLoader = new THREE.JSONLoader();

  // load our rock and create a ring of rocks
  geometryLoader.load('assets/rock.js', function ( rockGeometry, materials ) {
      var numRocks = 20;
      var ringRadius = 1.5;
      for(var i = 0; i < numRocks; ++i) {
        var rock = new THREE.Mesh(rockGeometry, tempMaterial);
        
        rock.position.x = ringRadius * Math.sin(i / numRocks * 2 * Math.PI);
        rock.position.z = ringRadius * Math.cos(i / numRocks * 2 * Math.PI);
        
        rock.rotation.y = Math.random() * Math.PI * 2;
        rock.scale.x = rock.scale.y = rock.scale.z = Math.random() * 0.1 + 1;
        
        scene.add(rock);
      }
  	}
  );
  
  // Create our lights
  var ambientLight = new THREE.HemisphereLight(0x000040, 0x000000);
  scene.add(ambientLight);
  
  firelight = new THREE.PointLight(0xff5500, 1, 12);
  firelight.position.y = 1;
  scene.add(firelight);
  
  // Create our fire sprite
  texLoader.load('assets/fire.png', function ( texture ) {
    var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff} );
    flame = new THREE.Sprite( material );
    flame.position.y = 0.8;
    scene.add( flame );
  });
  
  // Create our sparks
  var particleCount = 20;
  sparks = new THREE.Geometry();
  var sparkMaterial = new THREE.PointsMaterial({ color: 0xffd24d, size: 0.03 });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {
    var pX = Math.random() * 1 - 0.5;
    var pZ = Math.random() * 1 - 0.5;
    var particle = new THREE.Vector3(pX, 0.5 + p * 0.2, pZ);

    // add it to the geometry
    sparks.vertices.push(particle);
  }

  var particleSystem = new THREE.Points(sparks, sparkMaterial);
  scene.add(particleSystem);
  
  requestAnimationFrame(animate);
}

// Our looping function
function animate(timestamp) {
  // Rotate the camera first
  cameraRig.rotation.y -= 0.002;
  
  // Now, flicker the light  
  firelight.intensity = Math.random() * 0.3 + 0.6;
  
  if(flame) {
    if(Math.random() > 0.5) {
      flame.scale.x = -1;
    } else {
      flame.scale.x = 1;
    }
    
    flame.position.x = Math.random() * 0.1 - 0.05;
    flame.position.z = Math.random() * 0.1 - 0.05;
    
    
    flame.scale.y = firelight.intensity * 1.5;
  }
  
  // Animate the sparks rising
  for(var i = 0; i < sparks.vertices.length; ++i) {
    sparks.vertices[i].y += 0.02;
    
    if(sparks.vertices[i].y > 5) {
      sparks.vertices[i].y = 0.5;
    }
  }
  sparks.verticesNeedUpdate = true;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
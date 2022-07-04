var canvas = document.getElementById('renderCanvas');

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  camera.upperBetaLimit = Math.PI / 2.2;

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  //Switch fountain on and off
  let switched = false;
  const pointerDown = (mesh) => {
    if (mesh === fountain) {
      switched = !switched;
      if (switched) {
        // Start the particle system
        particleSystem.start();
      } else {
        // Stop the particle system
        particleSystem.stop();
      }
    }
  };

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo.hit) {
          pointerDown(pointerInfo.pickInfo.pickedMesh);
        }
        break;
    }
  });

  // Create a particle system
  const particleSystem = new BABYLON.ParticleSystem('particles', 5000);

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture('./images/flare.png');

  // Where the particles come from
  particleSystem.emitter = new BABYLON.Vector3(-4, 0.8, -6); // emitted from the top of the fountain
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, -0.01); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.01, 0, 0.01); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.01;
  particleSystem.maxSize = 0.05;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;

  // Emission rate
  particleSystem.emitRate = 1500;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
  particleSystem.direction2 = new BABYLON.Vector3(1, 8, -1);

  // Power and speed
  particleSystem.minEmitPower = 0.2;
  particleSystem.maxEmitPower = 0.6;
  particleSystem.updateSpeed = 0.01;

  const fountainProfile = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(0.5, 0.2, 0),
    new BABYLON.Vector3(0.4, 0.2, 0),
    new BABYLON.Vector3(0.4, 0.05, 0),
    new BABYLON.Vector3(0.05, 0.1, 0),
    new BABYLON.Vector3(0.05, 0.8, 0),
    new BABYLON.Vector3(0.15, 0.9, 0),
  ];
  const fountain = BABYLON.MeshBuilder.CreateLathe(
    'fountain',
    { shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  fountain.position.x = -4;
  fountain.position.z = -6;

  buildSpriteTree();
  const skybox = buildSkybox();
  const { ground, largeGround } = buildDwellings();
  importCar();

  return scene;
};

const buildSpriteTree = () => {
  const spriteManagerTrees = new BABYLON.SpriteManager(
    'treesManager',
    './images/palmtree.webp',
    2000,
    { width: 512, height: 1024 },
    scene
  );

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }
};

const buildSkybox = () => {
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    './images/skybox',
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
};

const buildDwellings = () => {
  BABYLON.SceneLoader.ImportMeshAsync('', '', 'no-ground-village.glb');
  //Create Village ground
  const groundMat = new BABYLON.StandardMaterial('groundMat');
  groundMat.diffuseTexture = new BABYLON.Texture('./images/villagegreen.png');
  groundMat.diffuseTexture.hasAlpha = true;

  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 24,
    height: 24,
  });
  ground.material = groundMat;

  // large ground
  const largeGroundMat = new BABYLON.StandardMaterial('largeGroundMat');
  largeGroundMat.diffuseTexture = new BABYLON.Texture(
    './images/valleygrass.png'
  );

  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    'largeGround',
    './images/villageheightmap.webp',
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;

  return { ground, largeGround };
};

const importCar = () => {
  BABYLON.SceneLoader.ImportMeshAsync('', '', 'car.glb').then(() => {
    const car = scene.getMeshByName('car');
    car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    const animCar = new BABYLON.Animation(
      'carAnimation',
      'position.z',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const carKeys = [];

    carKeys.push({
      frame: 0,
      value: 10,
    });

    carKeys.push({
      frame: 200,
      value: -15,
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);

    //wheel animation
    const wheelRB = scene.getMeshByName('wheelRB');
    const wheelRF = scene.getMeshByName('wheelRF');
    const wheelLB = scene.getMeshByName('wheelLB');
    const wheelLF = scene.getMeshByName('wheelLF');

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
  });
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        'the available createEngine function failed. Creating the default engine instead'
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine shoguld not be null.';
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener('resize', function () {
  engine.resize();
});

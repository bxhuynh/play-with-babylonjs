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

  // This creates and initially positions a follow camera
  const camera = new BABYLON.FollowCamera(
    'FollowCam',
    new BABYLON.Vector3(-6, 0, 0),
    scene
  );

  camera.upperBetaLimit = Math.PI / 2.2;

  //The goal distance of camera from target
  camera.radius = 1;

  // The goal height of camera above local oriin (centre) of target
  camera.heightOffset = 8;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera.rotationOffset = 0;

  //Acceleration of camera in moving from current to goal position
  camera.cameraAcceleration = 0.005;

  //The speed at which acceleration is halted
  camera.maxCameraSpeed = 10;

  //camera.target is set after the target's creation

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  const walk = function (turn, dist) {
    this.turn = turn;
    this.dist = dist;
  };

  const track = [];
  track.push(new walk(86, 7));
  track.push(new walk(-85, 14.8));
  track.push(new walk(-93, 16.5));
  track.push(new walk(48, 25.5));
  track.push(new walk(-112, 30.5));
  track.push(new walk(-72, 33.2));
  track.push(new walk(42, 37.5));
  track.push(new walk(-98, 45.2));
  track.push(new walk(0, 47));

  // Dude
  BABYLON.SceneLoader.ImportMeshAsync(
    'him',
    './scenes/',
    'Dude.babylon',
    scene
  ).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    dude.position = new BABYLON.Vector3(-6, 0, 0);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-95),
      BABYLON.Space.LOCAL
    );
    const startRotation = dude.rotationQuaternion.clone();

    camera.lockedTarget = dude;
    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        dude.rotate(
          BABYLON.Axis.Y,
          BABYLON.Tools.ToRadians(track[p].turn),
          BABYLON.Space.LOCAL
        );
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new BABYLON.Vector3(-6, 0, 0);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
  });

  const spriteManagerTrees = new BABYLON.SpriteManager(
    'treesManager',
    './images/palmtree.webp',
    2000,
    { width: 512, height: 1024 },
    scene
  );

  //We create trees at random positions
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

  //Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 100 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    'textures/skybox',
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'valleyvillage.glb'
  );

  return scene;
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

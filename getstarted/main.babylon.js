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

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 10, -10)
  );

  // Size
  const box = BABYLON.MeshBuilder.CreateBox('box', {
    width: 2,
    height: 1.5,
    depth: 3,
  });
  const box1 = BABYLON.MeshBuilder.CreateBox('box', {});
  const box2 = BABYLON.MeshBuilder.CreateBox('box', {});
  box1.scaling.x = 2;
  box1.scaling.y = 1.5;
  box1.scaling.z = 3;
  box2.scaling = new BABYLON.Vector3(2, 1.5, 3);

  // Position
  box.position.x = -2.5;
  box.position.y = 0.7;
  box1.position.x = 0;
  box1.position.y = 1.2;
  box2.position.x = 2.5;
  box2.position.y = 1.7;

  // Orientation
  box.rotation.z = BABYLON.Tools.ToRadians(0);
  box1.rotation.z = BABYLON.Tools.ToRadians(30);
  box2.rotation.z = BABYLON.Tools.ToRadians(60);

  const material = new BABYLON.StandardMaterial('material1', scene);
  material.diffuseColor = new BABYLON.Color3(0, 1, 1);
  box.material = material;
  const material2 = new BABYLON.StandardMaterial('material2', scene);
  material2.diffuseColor = new BABYLON.Color3(1, 1, 0);
  box1.material = material2;
  const material3 = new BABYLON.StandardMaterial('material3', scene);
  material3.diffuseColor = new BABYLON.Color3(1, 0, 0);
  // material3.wireframe = true;
  box2.material = material3;

  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 10,
    height: 5,
  });
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);

  groundMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
  ground.material = groundMaterial;

  ground.material = groundMaterial;

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
  if (!engine) throw 'engine should not be null.';
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

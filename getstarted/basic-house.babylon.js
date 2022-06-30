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
    new BABYLON.Vector3(0, 1, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  // let faceUV = [];
  // faceUV[0] = new BABYLON.Vector4(0.5, 0, 0.75, 1); //rear face
  // faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
  // faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
  // faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side

  // const box = BABYLON.MeshBuilder.CreateBox('box', {
  //   faceUV: faceUV,
  //   wrap: true,
  // });
  // box.position.y = 0.5;

  // const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {
  //   diameter: 1.3,
  //   height: 1.2,
  //   tessellation: 3,
  // });
  // roof.scaling.x = 0.75;
  // roof.rotation.z = Math.PI / 2;
  // roof.position.y = 1.2;

  // const roofMat = new BABYLON.StandardMaterial('roofMat');
  // roofMat.diffuseTexture = new BABYLON.Texture(
  //   'https://assets.babylonjs.com/environments/roof.jpg',
  //   scene
  // );
  // const boxMat = new BABYLON.StandardMaterial('boxMat');
  // boxMat.diffuseTexture = new BABYLON.Texture('cubehouse.webp');

  // roof.material = roofMat;
  // box.material = boxMat;

  let faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0);
  faceUV[1] = new BABYLON.Vector4(0, 0, 0.4, 1);
  faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1);
  faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1);

  var box = BABYLON.MeshBuilder.CreateBox(
    'box',
    { width: 2, faceUV: faceUV, wrap: true },
    scene
  );

  var cylinder = BABYLON.MeshBuilder.CreateCylinder(
    'cylinder',
    { height: 2.2, diameter: 1.3, tessellation: 3 },
    scene
  );

  cylinder.rotation.z = BABYLON.Tools.ToRadians(90);
  cylinder.position.y = 1.22;

  box.position.y = 0.5;

  const prismMat = new BABYLON.StandardMaterial('prismMat', scene);
  prismMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/roof.jpg'
  );
  cylinder.material = prismMat;

  const boxMat = new BABYLON.StandardMaterial('boxMat', scene);
  boxMat.diffuseTexture = new BABYLON.Texture('semihouse.webp');
  box.material = boxMat;

  const ground = buildGround();
  return scene;
};

const buildGround = () => {
  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 10,
    height: 10,
  });
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0, 0.9, 0.4);
  ground.material = groundMaterial;
  return ground;
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

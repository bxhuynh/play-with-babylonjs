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

  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  BABYLON.SceneLoader.ImportMeshAsync('', '', 'village.glb');

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

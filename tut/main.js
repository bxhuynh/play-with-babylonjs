window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('canvas');
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White();

    // var camera = new BABYLON.FreeCamera(
    //   'camera1',
    //   new BABYLON.Vector3(0, 0, -10),
    //   scene
    // );
    // camera.setTarget(BABYLON.Vector3.Zero());
    // camera.attachControl(canvas, true);

    // camera.keysUp.push(87);
    // camera.keysDown.push(83);
    // camera.keysLeft.push(65);
    // camera.keysRight.push(68);

    // -----------------
    // var box = BABYLON.Mesh.CreateBox('box', 4.0, scene);

    // var camera = new BABYLON.ArcRotateCamera(
    //   'arcCamera',
    //   BABYLON.Tools.ToRadians(45),
    //   BABYLON.Tools.ToRadians(45),
    //   10.0,
    //   box.position,
    //   scene
    // );

    // camera.attachControl(canvas, true);

    // -----------------

    var box = BABYLON.Mesh.CreateBox('box', 4.0, scene);
    var box2 = BABYLON.Mesh.CreateBox('box2', 4.0, scene);
    var material = new BABYLON.StandardMaterial('material1', scene);
    material.wireframe = true;
    box2.material = material;
    box2.position = new BABYLON.Vector3(0, 4, 0);

    var camera = new BABYLON.FollowCamera(
      'followCam',
      new BABYLON.Vector3.Zero(),
      scene
    );
    camera.lockedTarget = box;
    camera.radius = 10;
    camera.heightOffset = 10;
    camera.attachControl(canvas, true);

    //-------------------

    var light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () {
    scene.getMeshByName('box').position.z += 0.01;
    scene.render();
  });
});

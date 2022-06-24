window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('canvas');
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White();

    var camera = new BABYLON.FreeCamera(
      'camera1',
      new BABYLON.Vector3(0, 6, -10),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var box = BABYLON.Mesh.CreateBox('box', 4.0, scene);

    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });
});

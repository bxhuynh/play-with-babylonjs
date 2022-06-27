window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('canvas');
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White();
    var box = BABYLON.Mesh.CreateBox('box', 4.0, scene);
    var camera = new BABYLON.ArcRotateCamera(
      'arcCamera',
      BABYLON.Tools.ToRadians(45),
      BABYLON.Tools.ToRadians(45),
      10.0,
      box.position,
      scene
    );
    camera.attachControl(canvas, true);

    // /* PointLight - think light bulb */
    // var light = new BABYLON.PointLight(
    //   'light',
    //   new BABYLON.Vector3(4, 10, 5),
    //   scene
    // );
    // light.diffuse = new BABYLON.Color3(1, 0, 0);

    // //turn on-off light
    // scene.actionManager = new BABYLON.ActionManager(scene);
    // scene.actionManager.registerAction(
    //   new BABYLON.ExecuteCodeAction(
    //     { trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: ' ' },
    //     function () {
    //       light.setEnabled(!light.isEnabled());
    //     }
    //   )
    // );

    // /* Spot Light = focused beam of light */
    // var light = new BABYLON.SpotLight(
    //   'spotLight',
    //   new BABYLON.Vector3(0, 10, 0),
    //   new BABYLON.Vector3(0, -1, 0),
    //   BABYLON.Tools.ToRadians(45),
    //   0.1
    // );

    /* Hemispheric Light - ambient light */
    var light = new BABYLON.HemisphericLight(
      'hemiLight',
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
    light.diffuse = new BABYLON.Color3(0, 1, 1);

    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () {
    // var light = scene.getLightByName('light');
    // light.diffuse.g += 0.01;
    // light.diffuse.b += 0.01;

    // var light = scene.getLightByName('spotLight');
    // light.position.x -= 0.01;

    scene.render();
  });
});

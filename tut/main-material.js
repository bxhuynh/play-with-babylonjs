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

    var light = new BABYLON.PointLight(
      'pointLight',
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
    light.parent = camera;
    light.diffuse = new BABYLON.Color3(1, 1, 1);

    var material = new BABYLON.StandardMaterial('material1', scene);
    // material.wireframe = true;
    // material.diffuseColor = BABYLON.Color3.Blue();
    // material.emissiveColor = BABYLON.Color3.Red();
    // material.specularColor = BABYLON.Color3.Red();
    // material.alpla = 0.9;

    material.diffuseTexture = new BABYLON.Texture('gfs.png');
    material.bumpTexture = new BABYLON.Texture('gfs_normal.png');
    box.material = material;

    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () {
    // var material = scene.getMeshByName('box').material;
    // material.alpha -= 0.01;
    // if (material.alpha <= 0) material.alpha = 1;

    scene.render();
  });
});

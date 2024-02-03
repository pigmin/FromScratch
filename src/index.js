import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

let engine;
let canvas;
let papa;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    let scene = createScene();

    engine.runRenderLoop(function () {
        papa.position.y +=0.005;
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    sphere.position.y = 1;

    var sphere2 = MeshBuilder.CreateSphere("sphere", {diameter: 1.2, segments: 32}, scene);
    sphere2.position.y = 2.2;

    // Our built-in 'ground' shape.
    var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    papa = MeshBuilder.CreateCapsule("papa", scene);
    papa.position = new Vector3(3, 2, 0);

    return scene;
};
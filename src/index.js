import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Inspector } from '@babylonjs/inspector';


import meshUrl from "../assets/models/HVGirl.glb";
import mountainUrl from "../assets/models/mount_timpanogos_early_2017.glb";

let engine;
let canvas;
let papa;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    let scene = createScene();

    Inspector.Show(scene, {});

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
    var camera = new FreeCamera("camera1", new Vector3(0, .5, -1), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;


    // Our built-in 'ground' shape.
    //var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    papa = MeshBuilder.CreateCapsule("papa", scene);
    papa.position = new Vector3(3, 2, 0);

    SceneLoader.ImportMesh("", "", meshUrl, scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        newMeshes[0].name = "Player";
        newMeshes[0].scaling = new Vector3(0.01, 0.01, 0.01);
        camera.target = newMeshes[0];
    });

    
    SceneLoader.ImportMesh("", "", mountainUrl, scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        newMeshes[0].name = "mountain";
        newMeshes[0].position = new Vector3(0, -15, 0);
        //newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
        
    });

    return scene;
};
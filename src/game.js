import { FreeCamera, HemisphericLight, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";



import meshUrl from "../assets/models/HVGirl.glb";
import mountainUrl from "../assets/models/mount_timpanogos_early_2017.glb";

class Game {

    engine;
    canvas;
    scene;

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }

    init() {
        this.createScene();

        Inspector.Show(this.scene, {});
    }

    start() {

        this.engine.runRenderLoop( () => {
            this.scene.render();
        });
    }

    update() {
        
    }

    createScene() {

        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);
    
        // This creates and positions a free camera (non-mesh)
        this.camera = new FreeCamera("camera1", new Vector3(0, .5, -1), this.scene);
    
        // This targets the camera to scene origin
        this.camera.setTarget(Vector3.Zero());
    
        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);
    
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    
    
        // Our built-in 'ground' shape.
        //var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    
    
        SceneLoader.ImportMesh("", "", meshUrl, this.scene, (newMeshes) => {
            // Set the target of the camera to the first imported mesh
            newMeshes[0].name = "Player";
            newMeshes[0].scaling = new Vector3(0.01, 0.01, 0.01);
            this.camera.target = newMeshes[0];
        });
    
        
        SceneLoader.ImportMesh("", "", mountainUrl, this.scene, (newMeshes) => {
            // Set the target of the camera to the first imported mesh
            newMeshes[0].name = "mountain";
            newMeshes[0].position = new Vector3(0, -15, 0);
            //newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
            
        });

    }  
}

export default Game;
import { Color3, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, Scalar, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

const TRACK_WIDTH = 8;
const TRACK_HEIGHT = 0.1;
const TRACK_DEPTH = 3;
const BORDER_HEIGHT = 0.5;
const NB_TRACKS = 50;
const NB_OBSTACLES = 10;
const SPAWN_POS_Z = (TRACK_DEPTH * NB_TRACKS);
const SPEED_Z = 50;
const SPEED_X = 10;

import meshUrl from "../assets/models/player.glb";
import mountainUrl from "../assets/models/mount_timpanogos_early_2017.glb";
import roadTextureUrl from "../assets/textures/dd719e47a144a8ed5f56999b21ffafeb.jpg";

class Game {

    engine;
    canvas;
    scene;

    startTimer;

    player;
    obstacles = [];
    tracks = [];

    inputMap = {};
    actions = {};

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }

    init() {
        this.createScene();

        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    //console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    //console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
            }
        });        

        Inspector.Show(this.scene, {});
    }

    start() {

        this.startTimer = 0;
        this.engine.runRenderLoop(() => {

            
            let delta = this.engine.getDeltaTime() / 1000.0;
            
            this.updateMoves(delta);
            this.update(delta);

            this.scene.render();
        });
    }

    update(delta) {

        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];

            obstacle.position.z -= (SPEED_Z * delta);
            if (obstacle.position.z < 0) {
                let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
                let z = Scalar.RandomRange(SPAWN_POS_Z - 15, SPAWN_POS_Z + 15);
                obstacle.material.diffuseColor = new Color3(Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1));
                obstacle.position.set(x, 0.5, z);
            }
        }


        // this.tracks[lastIndex].position.y = Math.sin(this.startTimer*10 ) / 2;
        for (let i = 0; i < this.tracks.length; i++) {
            let track = this.tracks[i];
            track.position.z -= SPEED_Z/3 * delta;
        }
        for (let i = 0; i < this.tracks.length; i++) {
            let track = this.tracks[i];
            if (track.position.z <= 0) {
                let nextTrackIdx = (i + this.tracks.length - 1) % this.tracks.length;
                //on le repositionne ET on le déplace aussi
                track.position.z = this.tracks[nextTrackIdx].position.z + TRACK_DEPTH;
                //track.position.y = Math.sin(this.startTimer*10 ) * TRACK_HEIGHT;

            }
        }

        this.startTimer += delta;
    }

    updateMoves(delta) {
        if (this.inputMap["KeyA"])
        {
            this.player.position.x -= SPEED_X * delta;
            if (this.player.position.x < -3.75)
                this.player.position.x = -3.75;
        }
        else if (this.inputMap["KeyD"])
        {
            this.player.position.x += SPEED_X * delta;
            if (this.player.position.x > 3.75)
                this.player.position.x = 3.75;
        }

        if (this.actions["Space"]) {
            //TODO jump
        }
    }

    createScene() {

        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.fogMode = Scene.FOGMODE_LINEAR;
        this.scene.fogStart = SPAWN_POS_Z - 30;
        this.scene.fogEnd = SPAWN_POS_Z;
        this.scene.fogColor = new Color3(0.6, 0.6, 0.85);

        // This creates and positions a free camera (non-mesh)
        this.camera = new FreeCamera("camera1", new Vector3(0, 3.8, 0), this.scene);

        // This targets the camera to scene origin
        this.camera.setTarget(new Vector3(0, 3, 3));

        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

    // Finally create the motion blur effect :)
    var mb = new MotionBlurPostProcess('mb', this.scene, 1.0, this.camera);
    mb.motionStrength = 64;

        // Our built-in 'ground' shape.
        //var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);


        SceneLoader.ImportMesh("", "", meshUrl, this.scene, (newMeshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights) => {
            // Set the target of the camera to the first imported mesh
            this.player = newMeshes[0];
            mb.excludeSkinnedMesh(this.player);
            newMeshes[0].name = "Player";
            newMeshes[0].scaling = new Vector3(1, 1, 1);
            newMeshes[0].position.set(0, TRACK_HEIGHT / 2, 6);
            newMeshes[0].rotation = new Vector3(0, 0, 0);
            animationGroups[0].stop();
            animationGroups[1].play(true);
            this.camera.target = newMeshes[0];
        });

        let mainTrack = MeshBuilder.CreateBox("trackmiddle", { width: TRACK_WIDTH, height: TRACK_HEIGHT, depth: TRACK_DEPTH });
        mainTrack.position = new Vector3(0, 0, 0);
        let matRoad = new StandardMaterial("road");
        let tex = new Texture(roadTextureUrl);
        matRoad.diffuseTexture = tex;
        mainTrack.material = matRoad;
        for (let i = 0; i < NB_TRACKS; i++) {
            let newTrack = mainTrack.clone();
            newTrack.position.z = TRACK_DEPTH * i;
            this.tracks.push(newTrack);
        }
        mainTrack.dispose();
                
                SceneLoader.ImportMesh("", "", mountainUrl, this.scene, (newMeshes) => {
                    // Set the target of the camera to the first imported mesh
                    newMeshes[0].name = "mountain";
                    newMeshes[0].position = new Vector3(-18, -31.3, 123.2);
                    newMeshes[0].rotation = new Vector3(0, Math.PI/2, 0);
                    newMeshes[0].scaling = new Vector3(2, 2, 2);
                    
                });

        let obstacleModele = MeshBuilder.CreateBox("obstacle", { width: 0.5, height: 1, depth: 1 }, this.scene);
        let mat = new StandardMaterial("mat", this.scene);
        mat.diffuseColor = new Color3(Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1));
        obstacleModele.material = mat;
        for (let i = 0; i < NB_OBSTACLES; i++) {
            let obstacle = obstacleModele.clone("");

            let w = Scalar.RandomRange(0.2, 3);
            let h = Scalar.RandomRange(.2, 2);
            let d = Scalar.RandomRange(0.2, 3);
            obstacle.scaling.set(w, h, d);

            let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
            let z = Scalar.RandomRange(SPAWN_POS_Z - 15, SPAWN_POS_Z + 15);
            obstacle.position.set(x, h / 2, z);

            let mat = new StandardMaterial("mat", this.scene);
            mat.diffuseColor = new Color3(Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1), Scalar.RandomRange(0, 1));
            obstacle.material = mat;

            this.obstacles.push(obstacle);
        }
        obstacleModele.dispose();
    }
}

export default Game;
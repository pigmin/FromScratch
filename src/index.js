import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { Inspector } from '@babylonjs/inspector';
import Game from "./game";


let engine;
let canvas;
let game;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    window.addEventListener("resize", function () {
        engine.resize();
    });

    game = new Game(engine, canvas);
    game.init();
    game.start();


}


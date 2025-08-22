import * as THREE from 'three';
import {VRButton} from 'three/examples/jsm/webxr/VRButton.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {LabeledCube} from './cube';
import {isWebXrAvailable} from "./browser-support.ts";

async function init() {
    // Labels laden
    const response = await fetch('labels.json');
    const data = await response.json();

    // Szene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Würfel erzeugen
    const cube = new LabeledCube(data.faces).mesh;
    cube.position.z = -2; // 2 Meter vor dir platzieren
    scene.add(cube);

    // Licht
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Resize Handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Prüfen ob WebXR verfügbar ist
    if (await isWebXrAvailable()) {
        // VR aktivieren
        renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(renderer));

        const controller = renderer.xr.getController(0);
        scene.add(controller);

        renderer.setAnimationLoop(() => {
            // Optional: Controller-Input
            const session = renderer.xr.getSession();
            if (session) {
                for (const source of session.inputSources) {
                    const gp = source.gamepad;
                    if (gp && gp.axes.length >= 2) {
                        const [x, y] = gp.axes;
                        cube.rotation.y += x * 0.02;   // Joystick links/rechts = drehen
                        cube.position.z += y * 0.05;   // Joystick hoch/runter = zoom
                    }
                }
            }

            // Sehr langsame Eigenrotation
            cube.rotation.y += 0.001;

            renderer.render(scene, camera);
        });
    } else {
        // Fallback: OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.001;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }
}

init();

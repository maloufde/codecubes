import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LabeledCube } from './cube';

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
    if (navigator.xr && await navigator.xr.isSessionSupported('immersive-vr')) {
        // VR aktivieren
        renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(renderer));

        renderer.setAnimationLoop(() => {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        });
    } else {
        console.log("WebXR nicht unterstützt, nutze OrbitControls.");
        // Fallback: OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }
}

init();

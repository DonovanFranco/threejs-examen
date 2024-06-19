import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let camera, controls, scene, renderer, object;
let mixer;
const clock = new THREE.Clock();

// Parámetros para la interfaz gráfica
const params = {
    asset: 'Dancing Twerk'
};

// Lista de activos disponibles
const assets = [
    'Offensive Idle',          
    'Reaction',                
    'Roundhouse Kick',           
    'Walking',                 
    'Dancing Twerk',       
    'Fast Run', 
    'Punching Bag'              
];

init();

function init() {
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x323b40);
    scene.fog = new THREE.FogExp2(0x88ebd4, 0.002);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    // Set up the camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);

    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    controls.maxPolarAngle = Math.PI / 2;

    // Add world objects
    const geometry = new THREE.ConeGeometry(50, 150, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x211370, flatShading: true });

    for (let i = 0; i < 30; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 75;
        mesh.position.z = Math.random() * 1600 - 800;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
    }

    // Add lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // Load initial FBX model
    loadAsset('Offensive Idle');

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Add keydown event listener
    document.addEventListener('keydown', onKeyDown);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

// Function to load FBX asset
function loadAsset(asset) {
    const loader = new FBXLoader();
    console.log(`Loading asset: ${asset}`); // Log the asset being loaded
    loader.load('models/fbx/' + asset + '.fbx', function (group) {
        if (object) {
            // Dispose previous object
            object.traverse(function (child) {
                if (child.material) {
                    child.material.dispose();
                    if (child.material.map) child.material.map.dispose();
                }
                if (child.geometry) child.geometry.dispose();
            });
            scene.remove(object);
        }

        object = group;

        if (object.animations && object.animations.length) {
            mixer = new THREE.AnimationMixer(object);
            const action = mixer.clipAction(object.animations[0]);
            action.play();
            console.log(`Animation loaded: ${asset}`); // Log the animation being played
        } else {
            mixer = null;
            console.log(`No animations found for asset: ${asset}`); // Log if no animations are found
        }

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshPhongMaterial(); 
            }
        });

        scene.add(object);
    }, undefined, function (error) {
        console.error(`Error loading asset: ${asset}`, error); // Log any errors that occur
    });
}

// Function to handle keydown events
function onKeyDown(event) {
    switch (event.keyCode) {
        case 49: // Key 1
            loadAsset('Offensive Idle');
            break;
        case 50: // Key 2
            loadAsset('Boxing');
            break;
        case 51: // Key 3
            loadAsset('Roundhouse Kick');
            break;
        case 52: // Key 4
            loadAsset('Walking');
            break;
        case 53: // Key 5
            loadAsset('Dancing Twerk');
            break;
        case 54: // Key 6
            loadAsset('Fast Run');
            break;
        case 55: // Key 7
            loadAsset('Punching Bag');
            break;
    }
}
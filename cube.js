//import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls'

// Our Javascript will go here.

// Start of Lego class
class legoPiece extends THREE.Group {
    
    constructor(depth,width)
    {
        super();
        let meshMaterial = new THREE.MeshStandardMaterial( {color: '#4287f5'} );
        meshMaterial.flatShading = true;
        let box = new THREE.Mesh(new THREE.BoxGeometry(width, 1, depth), meshMaterial);
        box.castShadow = true;
        box.receiveShadow = false;
        this.add(box); // Adds the lego components to itself
        this.depth = depth;
        this.width = width;
        for(let i = 0; i < depth*width; i++) {
           let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .5, 100), meshMaterial);
           cylinder.castShadow = true;
           cylinder.receiveShadow = false;
           cylinder.position.set(, .45, 0);
           this.add(cylinder);
        }
    }
}
const piece = new legoPiece(1,1);
// End of Lego class

const scene = new THREE.Scene();
const lego2x1 = new THREE.Group();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(piece);



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 10); //default; light shining from top
light.castShadow = true; // default false
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const geometry = new THREE.BoxGeometry(2, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
cubeMaterial.flatShading = true;
const cube = new THREE.Mesh(geometry, cubeMaterial);
cube.castShadow = true;
cube.receiveShadow = false;
lego2x1.add(cube);

const cylinderGeometry = new THREE.CylinderGeometry( .3, .3, .5, 100 );
const cylinderMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff} );
cylinderMaterial.flatShading = true;
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
const cylinder2 = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
cylinder.position.set(.5, .45, 0);
cylinder2.position.set(-.5, .45, 0);
cylinder.castShadow = true;
cylinder.receiveShadow = false;
cylinder2.castShadow = true;
cylinder2.receiveShadow = false;
lego2x1.add( cylinder );
lego2x1.add( cylinder2 );

// scene.add(lego2x1);

camera.position.z = 5;

const PressedKeyHandlers = Object.freeze({
    'ArrowLeft': () => {
        piece.rotation.y -= 0.05;
        // camera.position.x -= 0.1;
    },
    'ArrowUp': () => {
        piece.rotation.x-= 0.05;
        // camera.position.x += 0.1;
    },
    'ArrowRight': () => {
        piece.rotation.y+= 0.05;
        // camera.position.y += 0.1;
    },
    'ArrowDown': () => {
        piece.rotation.x += 0.05;
        // camera.position.y -= 0.1;
    },
});

const pressedKeys = new Set();
document.addEventListener('keydown', e => {
    pressedKeys.add(e.key);
});
document.addEventListener('keyup', e => {
    pressedKeys.delete(e.key);
});

function animate() {
    requestAnimationFrame(animate);

    for (const key of pressedKeys) {
        PressedKeyHandlers[key]?.();
    }
    
    renderer.render(scene, camera);
};

animate();

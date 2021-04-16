import {
	AmbientLight,
	AnimationMixer,
	AxesHelper,
	Box3,
	Cache,
	CubeTextureLoader,
	DirectionalLight,
	GridHelper,
	HemisphereLight,
	LinearEncoding,
	LoaderUtils,
	LoadingManager,
	PMREMGenerator,
	PerspectiveCamera,
	RGBFormat,
	Scene,
	SkeletonHelper,
	UnsignedByteType,
	Vector3,
	WebGLRenderer,
	sRGBEncoding,
  } from 'three';

import { GUI } from 'dat.gui';
import { createBackground } from '../lib/three-vignette.js';
import { environments } from '../assets/environment/index.js';

const Preset = {ASSET_GENERATOR: 'assetgenerator'};
const DEFAULT_CAMERA = '[default]';
const IS_IOS = isIOS();

this.state = {
	environment: options.preset === Preset.ASSET_GENERATOR
	  ? environments.find((e) => e.id === 'footprint-court').name
	  : environments[1].name,
	background: false,
	playbackSpeed: 1.0,
	actionStates: {},
	camera: DEFAULT_CAMERA,
	wireframe: false,
	skeleton: false,
	grid: false,

	// Lights
	addLights: true,
	exposure: 1.0,
	textureEncoding: 'sRGB',
	ambientIntensity: 0.3,
	ambientColor: 0xFFFFFF,
	directIntensity: 0.8 * Math.PI, // TODO(#116)
	directColor: 0xFFFFFF,
	bgColor1: '#ffffff',
	bgColor2: '#353535'
  };

this.prevTime = 0;

this.stats = new Stats();
this.stats.dom.height = '48px';
[].forEach.call(this.stats.dom.children, (child) => (child.style.display = ''));

var scene = new THREE.Scene();

const fov = options.preset === Preset.ASSET_GENERATOR
      ? 0.8 * 180 / Math.PI
      : 60;
this.defaultCamera = new PerspectiveCamera( fov, el.clientWidth / el.clientHeight, 0.01, 1000 );
this.activeCamera = this.defaultCamera;
scene.add( this.defaultCamera );

this.renderer = window.renderer = new WebGLRenderer({antialias: true});
this.renderer.physicallyCorrectLights = true;
this.renderer.outputEncoding = sRGBEncoding;
this.renderer.setClearColor( 0xcccccc );
this.renderer.setPixelRatio( window.devicePixelRatio );
this.renderer.setSize( el.clientWidth, el.clientHeight );

this.pmremGenerator = new PMREMGenerator( this.renderer );
this.pmremGenerator.compileEquirectangularShader();

this.controls = new OrbitControls( this.defaultCamera, this.renderer.domElement );
this.controls.autoRotate = false;
this.controls.autoRotateSpeed = -10;
this.controls.screenSpacePanning = true;

this.vignette = createBackground({
    aspect: this.defaultCamera.aspect,
    grainScale: IS_IOS ? 0 : 0.001, // mattdesl/three-vignette-background#1
    colors: [this.state.bgColor1, this.state.bgColor2]
    });
this.vignette.name = 'Vignette';
this.vignette.renderOrder = -1;

this.el.appendChild(this.renderer.domElement);

this.cameraCtrl = null;
this.cameraFolder = null;
this.animFolder = null;
this.animCtrls = [];
this.morphFolder = null;
this.morphCtrls = [];
this.skeletonHelpers = [];
this.gridHelper = null;
this.axesHelper = null;

this.addAxesHelper();
this.addGUI();
if (options.kiosk) this.gui.close();

this.animate = this.animate.bind(this);
requestAnimationFrame( this.animate );
window.addEventListener('resize', this.resize.bind(this), false);

render () {

    this.renderer.render( this.scene, this.activeCamera );
    if (this.state.grid) {
      this.axesCamera.position.copy(this.defaultCamera.position)
      this.axesCamera.lookAt(this.axesScene.position)
      this.axesRenderer.render( this.axesScene, this.axesCamera );
    }
  }

  resize () {

    const {clientHeight, clientWidth} = this.el.parentElement;

    this.defaultCamera.aspect = clientWidth / clientHeight;
    this.defaultCamera.updateProjectionMatrix();
    this.vignette.style({aspect: this.defaultCamera.aspect});
    this.renderer.setSize(clientWidth, clientHeight);

    this.axesCamera.aspect = this.axesDiv.clientWidth / this.axesDiv.clientHeight;
    this.axesCamera.updateProjectionMatrix();
    this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);
  }
//	

var collisionMesh = [];
var gravityOnOff = true;
var arrayPos= [];
var contadorIteraciones;

//scene.background = new THREE.Color( 0xecf7f9);
var camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set( 1, 1, 12 );
//var renderer = new THREE.WebGLRenderer({ alpha: true });
container = document.getElementById('frame');
renderer.setSize(container.offsetWidth, container.offsetHeight);
document.body.appendChild( container );
container.appendChild(renderer.domElement);
		
//var ambientLight = new THREE.AmbientLight( 0xcccccc );
//scene.add( ambientLight );
							
//var directionalLight = new THREE.DirectionalLight( 0xf5f5f5,0.3 );
//directionalLight.position.set( 50, 20, 200).normalize();
//scene.add( directionalLight );		

//var directionalLight2 = new THREE.DirectionalLight( 0xf5f5f5,0.3);
//directionalLight2.position.set( -50, -20, -200).normalize();
//scene.add( directionalLight2 );		

//object array
var objetos=[];
var objetos2=[];

//CONTROLS
var controls2 = new THREE.DragControls( objetos2, camera, renderer.domElement );
var controls = new THREE.OrbitControls( camera, renderer.domElement );	

// add event listener to highlight dragged objects

controls2.addEventListener( 'dragstart', function ( event ) {
		
	controls.enabled = false;
	gravityOnOff=false;
} );

controls2.addEventListener( 'dragend', function ( event ) {

	controls.enabled = true;
	gravityOnOff=true;
} );

//
function clear_canvas(){
	for(var i = scene.children.length - 1; i >= 0; i--) { 
		obj = scene.children[i];
		scene.remove(obj); 
   }
}

//
function uld(model_name){

	// Instantiate a loader
	var loader = new THREE.GLTFLoader();		
	// Load a glTF resource
	loader.load(model_name, function ( gltf ) {

		scene.add( gltf.scene );
		obj = scene.children[0];
		const box = new THREE.Box3().setFromObject(obj);
		const size = box.getSize(new THREE.Vector3()).length();
		const center = box.getCenter(new THREE.Vector3());

		obj.position.x += (obj.position.x - center.x);
		obj.position.y += (obj.position.y - center.y);
		obj.position.z += (obj.position.z - center.z);	
	}, undefined, function ( error ) {
		console.error( error );
		});
};

//
function create_piece(){

	const loaderTexture = new THREE.TextureLoader();
	loaderTexture.load('images/box.jpg', (texture) => {
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		});
        let geometry;
        if(document.getElementsByName("units")[0].checked){
			geometry = new THREE.BoxGeometry(document.getElementsByName("width")[0].value/100,document.getElementsByName("height")[0].value/100,document.getElementsByName("length")[0].value/100);
			} 
            if(document.getElementsByName("units")[1].checked)
            {
            geometry = new THREE.BoxGeometry(document.getElementsByName("width")[0].value/39.37,document.getElementsByName("height")[0].value/39.37,document.getElementsByName("length")[0].value/39.37);
            } 
            var cube = new THREE.Mesh( geometry, material );
						 
		cube.userData = [];
		scene.add(cube);
		objetos.push(cube);	
		objetos2.push(cube);
			
	});
}

function gravity(_mesh){

	let anyTarget= new THREE.Vector3();
	let floorY = distanceToNextObject(_mesh , "y")

	var box = new THREE.Box3().setFromObject(_mesh);
	const halfPc = box.getSize(anyTarget).y/2;

	if(gravityOnOff){
		mesh.position.y = floorY + halfPc+0.01;	
	}
}		

//		
function createUserData(){
    for(i=0;i<objetos.length;i++){	

    	objetos[i].userData = [];
   	}
}

function savePos(_mesh) {
	var collisionBool=false;
	var collisionBoolAll=false;
	var collisionPoint;
	let collisionBoolArray=[];
		
	var originPoint = _mesh.position.clone();

    for (var vertexIndex = 0; vertexIndex < _mesh.geometry.vertices.length; vertexIndex++) {
            
        var localVertex = _mesh.geometry.vertices[vertexIndex].clone();       
        var globalVertex = localVertex.applyMatrix4(_mesh.matrix);
        var directionVector = globalVertex.sub(_mesh.position);
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collisionMesh);

        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          
            collisionBool=true;
            collisionBoolArray.push(collisionBool);
            collisionPoint=collisionResults[0].point;
             
            controls2.enabled=false;    
        }
        else{
        	controls2.enabled=true;
        	collisionBool=false;
        	collisionBoolArray.push(collisionBool);
        }    
    }
        
	let contadorTrue=0;
	for (var i = 0; i< collisionBoolArray.length;i++) {
    	if(collisionBoolArray[i]===true){
    		contadorTrue+=1;
    	}
	}

	if(contadorTrue>0){
    	collisionBoolAll=true;
	}

	let posVector = _mesh.position.clone();
	_mesh.userData.push([posVector,collisionBoolAll,collisionBoolArray]);

	if(_mesh.userData.length>50){
    	_mesh.userData.shift();
	}            	
}

function checkCollision2(_mesh) {
	var collisionBool=false;
	var collisionBoolAll=false;
	var collisionPoint;
	let collisionBoolArray=[];
		
    var originPoint = _mesh.position.clone();

    for (var vertexIndex = 0; vertexIndex < _mesh.geometry.vertices.length; vertexIndex++) {
            
        var localVertex = _mesh.geometry.vertices[vertexIndex].clone();    
        var globalVertex = localVertex.applyMatrix4(_mesh.matrix);
        var directionVector = globalVertex.sub(_mesh.position);
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collisionMesh);
           
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          
            collisionBool=true;
            collisionBoolArray.push(collisionBool);
            collisionPoint=collisionResults[0].point;   
            controls2.enabled=false;
           
        }
        else{
        	controls2.enabled=true;
        	collisionBool=false;
        	collisionBoolArray.push(collisionBool);
        }
    }
    let contadorTrue=0;
    for (var i = 0; i< collisionBoolArray.length;i++) {
    	if(collisionBoolArray[i]===true){
    		contadorTrue+=1;
    	}
    }

    if(contadorTrue>0){
    	collisionBoolAll=true;
    }
             	
    return [collisionBoolAll,collisionPoint];
}

		
var animate = function (){
	requestAnimationFrame(animate);
	renderer.render(scene,camera);
	controls.update();
				   
	var collvar;
	for(var i=1;i<objetos.length;i++){	
		savePos(objetos[i]);
			   		
		_mesh = objetos[i];
		if (collvar[0]){
			contadorIteraciones+=1;
			let j= Math.max(objetos[i].userData.length - contadorIteraciones-1,0);	
				   			
            _mesh.position.y=_mesh.userData[j][0].y;
            _mesh.position.x=_mesh.userData[j][0].x;
            _mesh.position.z=_mesh.userData[j][0].z;

		};	
	};
};

animate();
    

			

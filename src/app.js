var collisionMesh = [];
var gravityOnOff = true;
var arrayPos= [];
var count_iter;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer =  new THREE.WebGLRenderer({antialias: true});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor( 0xcccccc );
renderer.setPixelRatio( window.devicePixelRatio );

var background = createBackground();
scene.add(background);

// scene.background = new THREE.Color(0xf5f5f5);
var camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set( 1, 1, 12 );
container = document.getElementById('frame');
renderer.setSize(container.offsetWidth, container.offsetHeight);
document.body.appendChild( container );
container.appendChild(renderer.domElement);
		
var light = new THREE.AmbientLight( 0xcccccc );
scene.add( light );
							
var directionalLight = new THREE.DirectionalLight( 0xf5f5f5,0.3 );
directionalLight.position.set( 50, 20, 200).normalize();
scene.add( directionalLight );		

var directionalLight2 = new THREE.DirectionalLight( 0xf5f5f5,0.3);
directionalLight2.position.set( -50, -20, -200).normalize();
scene.add( directionalLight2 );		

//object array
var pieces=[];
var pieces2=[];

//CONTROLS
var controls2 = new THREE.DragControls( pieces2, camera, renderer.domElement );
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
		pieces.push(cube);	
		pieces2.push(cube);
			
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
    for(i=0;i<pieces.length;i++){	

    	pieces[i].userData = [];
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

function createBackground (opt) {
	opt = opt || {}
	var geometry = opt.geometry || new THREE.PlaneGeometry(2, 2, 1)
	var material = new THREE.RawShaderMaterial({
	  //vertexShader: VERT.vert,
	  //fragmentShader: FRAG.frag,
	  side: THREE.DoubleSide,
	  uniforms: {
		aspectCorrection: { type: 'i', value: false },
		aspect: { type: 'f', value: 1 },
		grainScale: { type: 'f', value: 0.005 },
		grainTime: { type: 'f', value: 0 },
		noiseAlpha: { type: 'f', value: 0.25 },
		offset: { type: 'v2', value: new THREE.Vector2(0, 0) },
		scale: { type: 'v2', value: new THREE.Vector2(1, 1) },
		smooth: { type: 'v2', value: new THREE.Vector2(0.0, 1.0) },
		color1: { type: 'c', value: new THREE.Color('#fff') },
		color2: { type: 'c', value: new THREE.Color('#283844') }
	  },
	  depthTest: false
	})
	var mesh = new THREE.Mesh(geometry, material)
	mesh.frustumCulled = false
	mesh.style = style
	if (opt) mesh.style(opt)
	return mesh
  
	function style (opt) {
	  opt = opt || {}
	  if (Array.isArray(opt.colors)) {
		var colors = opt.colors.map(function (c) {
		  if (typeof c === 'string' || typeof c === 'number') {
			return new THREE.Color(c)
		  }
		  return c
		})
		material.uniforms.color1.value.copy(colors[0])
		material.uniforms.color2.value.copy(colors[1])
	  }
	  if (typeof opt.aspect === 'number') {
		material.uniforms.aspect.value = opt.aspect
	  }
	  if (typeof opt.grainScale === 'number') {
		material.uniforms.grainScale.value = opt.grainScale
	  }
	  if (typeof opt.grainTime === 'number') {
		material.uniforms.grainTime.value = opt.grainTime
	  }
	  if (opt.smooth) {
		var smooth = fromArray(opt.smooth, THREE.Vector2)
		material.uniforms.smooth.value.copy(smooth)
	  }
	  if (opt.offset) {
		var offset = fromArray(opt.offset, THREE.Vector2)
		material.uniforms.offset.value.copy(offset)
	  }
	  if (typeof opt.noiseAlpha === 'number') {
		material.uniforms.noiseAlpha.value = opt.noiseAlpha
	  }
	  if (typeof opt.scale !== 'undefined') {
		var scale = opt.scale
		if (typeof scale === 'number') {
		  scale = [ scale, scale ]
		}
		scale = fromArray(scale, THREE.Vector2)
		material.uniforms.scale.value.copy(scale)
	  }
	  if (typeof opt.aspectCorrection !== 'undefined') {
		material.uniforms.aspectCorrection.value = Boolean(opt.aspectCorrection)
	  }
	}
  
	function fromArray (array, VectorType) {
	  if (Array.isArray(array)) {
		return new VectorType().fromArray(array)
	  }
	  return array
	}
  }
  
var animate = function (){
	requestAnimationFrame(animate);
	renderer.render(scene,camera);
	controls.update();
				   
	var collvar;
	for(var i=1;i<pieces.length;i++){	
		savePos(pieces[i]);
			   		
		_mesh = pieces[i];
		if (collvar[0]){
			count_iter+=1;
			let j= Math.max(pieces[i].userData.length - count_iter-1,0);	
				   			
            _mesh.position.y=_mesh.userData[j][0].y;
            _mesh.position.x=_mesh.userData[j][0].x;
            _mesh.position.z=_mesh.userData[j][0].z;

		};	
	};
};

animate();
    

			

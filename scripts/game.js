  ////////////Carregando Floresta//////////////

  var loadingManager;
  //Vetor que pode ser indexado por indes
  var models = {
	  arvore: {
		  obj:"images/arvores.obj",
		  mtl:"images/arvores.mtl",
		  mesh:null
	  },
	  maca: {
		obj:"images/apple.obj",
		mtl:"images/apple.mtl",
		mesh:null
	}
  };
  
  var floresta = {};
  

  
  
  
	////////////////////////////////////////////////



// Seta o tamanho da cena
var WIDTH = 1350,
HEIGHT = 600;
var peca;
var bateu = true;
var pontuacao = 0;
var count;
//Variaveis globias
var fieldWidth  = 400;
var fieldHeight = 200;
var pointLight, spotLight;
var cestaAltura = 40;
var cestaLargura = 90;
var cuboCestaProf = 20;
var paredeWidth = 300;
var paredeHeight = 300;
var paredeDepth = 500;
var pausado = false;
var cameraEstilo = false;
var velX = 4, velZ = 1, tempo = 0,tempoQueda = 0,velXFinal = 0;
var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4BD121
		});

var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x534d0d
		});

var groundMaterial =
		new THREE.MeshLambertMaterial(
		  {
			color: 0x888888
		  });
////////////////////////
// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();

// inicia o render
renderer.setSize(WIDTH, HEIGHT);

// linka o render a uma div do HTML
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);


var VIEW_ANGLE = 60; //Angulo de visao da camera
var ASPECT =2.2*(WIDTH/HEIGHT);
NEAR = 0.1 ;
FAR = 10000;

// var VIEW_ANGLE = 140; //Angulo de visao da camera
// // var VIEW_ANGLE = 500;
// var ASPECT =(WIDTH/HEIGHT)  ;
// NEAR = 0.1 ;
// FAR = 10000;
camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// set a default position for the camera
// not doing this somehow messes up shadow rendering
camera.position.z = 500;
// camera.position.x = -100;
// camera.rotation.z = -Math.PI/2;

////////////Criando esfera//////////////////////

// ---------------------------------
// Based on Aerotwist's cool tutorial - http://www.aerotwist.com/tutorials/getting-started-with-three-js/ 
// ---------------------------------

// set up the sphere vars
// lower 'segment' and 'ring' values will increase performance
var radius = 5,
segments = 6,
rings = 36;

// create the sphere's material
var sphereMaterial =
new THREE.MeshLambertMaterial(
{
color: 0xD43001
});

// Create a ball with sphere geometry
var ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius,
    segments,
    rings),
    sphereMaterial);

// add the sphere to the scene
//scene.add(ball);


// // Insere a luz ambiente
var light =  new THREE.HemisphereLight(0xffffff,0xffffff,0.6);

light.color.setHSL(0.6,1,0.6);

light.groundColor.setHSL(0.095,1,0.75);
light.position.set(0,50,0);
scene.add(light);
scene.background = new THREE.Color().setHSL(0.6,0,1);

scene.fog = new THREE.Fog(scene.background,1,5000);


/////////////////////Insere a luz direcional///////

var dirLight = new THREE.DirectionalLight(0xffffff,1);
dirLight.color.setHSL(0.1,1,0.95);
dirLight.position.set(-1,1.75,1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
/////////////////////////////////////////

//////////////////////Desenhando o chao/////////////////////////////////////
// cria o material do plano	
var planeWidth  = WIDTH*0.7;
var planeQuality = 0.5;
var planeHeight = HEIGHT * 0.6;
var planeMaterial =
new THREE.MeshLambertMaterial(
{
    color: 0xffffff
});

// create the playing surface plane
var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
    planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
    planeHeight,
    planeQuality,
    planeQuality),
    planeMaterial);

scene.add(plane);



/////////////////////////////////////////////////////////////////////


////////////////////Paddles//////////////////////////////////


// set up the paddle vars
paddleWidth = 10;
paddleHeight = 35;
paddleDepth = 10;
paddleQuality = 1;


var paddle1Material =
new THREE.MeshLambertMaterial(
{
    color: 0x66CDAA
});
var paddle2Material =
new THREE.MeshLambertMaterial(
{
    color: 0x00BFFF
});



// set up paddle 1
var paddle1 = new THREE.Mesh(
  new THREE.CubeGeometry(
	paddleWidth,
	paddleHeight,
	paddleDepth,
	paddleQuality,
	paddleQuality,
	paddleQuality),
  paddle1Material);

 
  ///////////////Carregando Arvore 3d///////////////////////
  var arvore;
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("images/");
  mtlLoader.load("arvores.mtl", function(materials){
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("images/");
      objLoader.load("arvores.obj", function(object){
		arvore = object;
		arvore.scale.set(10,10,30);
		arvore.rotation.x = Math.PI / 2;
		arvore.position.x = fieldWidth / 2 + 240;
          scene.add(arvore);
        }        
      );

    }
  );


  ///////////////Mesa/////////////
  var mesa;
  var tgaLoader = new THREE.MTLLoader();
  tgaLoader.setPath("images/");
  tgaLoader.load("mesa.mtl", function(materials){
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("images/");
      objLoader.load("mesa.obj", function(object){
		mesa = object;
		mesa.scale.set(445,70,495);
		mesa.rotation.x = Math.PI / 2;
		mesa.position.y -= 45;
		mesa.position.x -= 30;
		mesa.position.z = plane.position.z - 70;
          scene.add(mesa);
        }        
      );

    }
  );


  //////////////////Cesta//////////////////

  var cesta;
  var mtlLoader2 = new THREE.MTLLoader();
  mtlLoader2.setPath("images/");
  mtlLoader2.load("cesta.mtl", function(materials){
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("images/");
      objLoader.load("cesta.obj", function(object){
		cesta = object;
		cesta.scale.set(1.5,1,2.7);
		cesta.rotation.x = Math.PI / 2;
		cesta.position.z = cuboCesta.position.z - 10;
		cesta.position.x = cuboCesta.position.x;
		cesta.position.y = cuboCesta.position.y;
		  scene.add(cesta);
        }        
      );

    }
  );
  /////////////////////////////////////////

	
var chaoTextura = new THREE.TextureLoader().load("images/grama.png");
chaoTextura.wrapS = THREE.RepeatWrapping;
chaoTextura.wrapT = THREE.RepeatWrapping;
chaoTextura.repeat.set(20,20);


/////////////////Criando Chao//////////////////////

var chaoGeo = new THREE.PlaneBufferGeometry(10000,10000);

// var chaoMat = new THREE.MeshLambertMaterial (
// {color:0xffffff,specular: 0x050505});
// chaoMat.color.setHSL(0.095,1,0.75);

var chaoMat = new THREE.MeshLambertMaterial (
	{
		map:chaoTextura
	}
);
	// chaoMat.color.setHSL(0.095,1,0.75);
	

var chao = new THREE.Mesh(chaoGeo,chaoMat);
chao.position.z -= 70;
scene.add(chao);
////////////////////////////////////////////
	
// SKYDOME

var vertexShader = document.getElementById( 'vertexShader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
var uniforms = {
	topColor:    { value: new THREE.Color( 0x87CEFA ) },
	bottomColor: { value: new THREE.Color( 0x87CEFA ) },
	offset:      { value: 1 },
	exponent:    { value: 1 }
};
//uniforms.topColor.value.copy( light.color );

scene.fog.color.copy( uniforms.bottomColor.value );
scene.fog.far = 2800;

var skyGeo = new THREE.SphereBufferGeometry( 4000, 50, 15 );
var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );


var sky = new THREE.Mesh( skyGeo, skyMat );
sky.rotation.z = Math.PI ;
sky.rotation.x = Math.PI/2 ;
scene.add( sky );


//////////////////////////////////////

//   paddle1.receiveShadow = true;
//   paddle1.castShadow = true;
// add the paddle to the scene
//scene.add(paddle1);

// Set up the second paddle
paddle2 = new THREE.Mesh(
  new THREE.CubeGeometry(
	paddleWidth,
	paddleHeight,
	paddleDepth,
	paddleQuality,
	paddleQuality,
	paddleQuality),
  paddle2Material);


// Add the second paddle to the scene
//scene.add(paddle2);
paddle2.receiveShadow = true;
paddle2.castShadow = true;
// set paddles on each side of the table
paddle1.position.x = -planeWidth/2;
//paddle2.position.x = fieldWidth/2 - paddleWidth;

// lift paddles over playing surface
paddle1.position.z = paddleDepth;
//paddle2.position.z = paddleDepth;


//////////////////////////////////////////////////////////////////



	  	
		


	  
	  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	  renderer.shadowMapEnabled = true;	
	
			///////////Cesta//////////////////////
	  var cubeMaterial =
	  new THREE.MeshBasicMaterial(
	  {
	  color: 0xD43001
	  });
	  
	  var cuboCesta = new THREE.Mesh(new THREE.BoxGeometry(cestaAltura,cestaLargura,cuboCestaProf), cubeMaterial);
	  cuboCesta.position.x = paddle1.position.x - 20;
	  cuboCesta.position.y = paddle1.position.y;
	  cuboCesta.position.z = paddle1.position.z - 38;
	  //scene.add(cuboCesta);



	  /////////////////////Fruta//////////////////
	  var vetFrutasArv = [];
	  var vetFrutasMaca = [];
	  var maca;
	  var nFrutas = 2;
	
	  var raio = 10, numSeg = 6, aneis = 16  ;
	  var bola;
	 function geraFrutas()
{
	for (i =0;i< nFrutas;i++) {
		var cubeMaterial =
		new THREE.MeshBasicMaterial(
		{
		color: 0xff0000
		});
  
		bola = new THREE.Mesh(new THREE.SphereGeometry(raio,numSeg,aneis), cubeMaterial);
		bola.position.x = fieldWidth / 2 - raio + 25;

		while(true){
			
		yAleatorio = getRandomInt(200,-160);
		zAleatorio = getRandomInt(130,200);

			if(yAleatorio < 115 && yAleatorio> -160 && zAleatorio < 200 && zAleatorio > 130){ //Bolinha na copa maior da arvore
				bola.position.y = paddle1.position.y + yAleatorio;
				bola.position.z = paddle1.position.z + zAleatorio;
				maca = models.maca.mesh.clone();
				maca.position.x = bola.position.x;
				maca.position.y = bola.position.y;
				maca.position.z = bola.position.z;
				maca.scale.set(4, 4, 4);
				maca.rotation.set(Math.PI / 2,0,0);
				vetFrutasMaca.push(maca);
				vetFrutasArv.push(bola);
				break;
			}else if(yAleatorio>115 && zAleatorio > 150){ //copa media
				bola.position.y = paddle1.position.y + yAleatorio;
				bola.position.z = paddle1.position.z + zAleatorio;
				bola.position.x = fieldWidth / 2 - raio + 95;
				vetFrutasArv.push(bola);
				maca = models.maca.mesh.clone();
				maca.position.x = bola.position.x;
				maca.position.y = bola.position.y;
				maca.position.z = bola.position.z;
				maca.scale.set(4, 4, 4);
				maca.rotation.set(Math.PI / 2,0,0);

				vetFrutasMaca.push(maca);
				break;	
			}
			
			//scene.add(bola);
		}
	 } 
	 
	 for (i =0;i< nFrutas;i++) {
		//scene.add(vetFrutasArv[i]);
		 scene.add(vetFrutasMaca[i]);
	 }
}


	//  var cubeMaterial =
	//   new THREE.MeshBasicMaterial(
	//   {
	//   color: 0xff0000
	//   });
	//   var raio = 10, numSeg = 6, aneis = 16  ;

	//   var bola = new THREE.Mesh(new THREE.SphereGeometry(raio,numSeg,aneis), cubeMaterial);
	//   bola.position.x = fieldWidth / 2 - raio;
	//   bola.position.y = 0;
	//   bola.position.z = paddle1.position.z + 130;
	//   scene.add(bola);



//////////////Camera fisica///////////////////////////
var posicaoCameraemZ = 470;
var rotacionarCamera = 170;
function cameraPhysics(isPrimeiraPessoa)
{
	// we can easily notice shadows if we dynamically move lights during the game
	// spotLight.position.x = ball.position.x * 2;
	// spotLight.position.y = ball.position.y * 2;
	
	// move to behind the player's paddle
	///////////////////////////////////////////////////////////////////

		if(Key.isDown(Key["1"])){
			cameraEstilo = false;

		  }
		  if(Key.isDown(Key["2"])){
			cameraEstilo = true;
		  }

	if(pausado){

	}else{
		if(Key.isDown(Key.A)){
			paddle1.position.y += 5;
			cesta.position.y += 5;
			cuboCesta.position.y += 5;
			if(paddle1.position.y >= (planeHeight/2.0) - (paddleHeight/2.0) + 40 ){
			  paddle1.position.y -= 5;
			  cesta.position.y =paddle1.position.y;
			  cuboCesta.position.y =paddle1.position.y;
			}
		  } else if(Key.isDown(Key.D)){
			 paddle1.position.y -= 5;
			 cesta.position.y -= 5;
			 cuboCesta.position.y -=5; 
			 if(paddle1.position.y <= -(planeHeight/2.0) + (paddleHeight/2.0) - 40 ){
			  paddle1.position.y += 5;
			  cesta.position.y =paddle1.position.y;
			  cuboCesta.position.y =paddle1.position.y;
			}
		  }

	} 
		

	
	
	

	  if(isPrimeiraPessoa == true){
		//1ª pessoa
	   
	   camera.position.x = -planeWidth/2 - 200;
	   camera.position.y = paddle1.position.y;
	   camera.position.z = paddle1.position.z +50;
   
	  
	   camera.rotation.x = -0.01 * Math.PI/180;
	   camera.rotation.y = -60 * Math.PI/133;//Somar= rotaciona para baixo; diminuir= rotaciona para cima;
	   camera.rotation.z = -90 * Math.PI/180;
	 }else{
		//3ª pessoa
		camera.position.x = -planeWidth/2 - 230;
		camera.position.y = paddle1.position.y;
		camera.position.z = paddle1.position.z +200;
   
	   camera.rotation.x = -0.01 * Math.PI/180;
	   camera.rotation.y = -60 * Math.PI/rotacionarCamera;//Somar= rotaciona para baixo; diminuir= rotaciona para cima;
	   camera.rotation.z = -90 * Math.PI/180;
	 }

}

////////////////////////////////////////////////


var podeCair = true;
var fruta, fruta3D;
var vetFrutasMesa  =[];
var vetFrutas3DMesa  =[];

var divPausado = document.querySelector("#textPause");
function draw()
{  
    // desenha a cena
    renderer.render(scene, camera);

    // loop da funcao draw()
    requestAnimationFrame(draw);
	cameraPhysics(cameraEstilo);

	mudarLuz();

	pausar();
		 if(pausado == true){
			divPausado.style.visibility = "visible";
		 }else{
			divPausado.style.visibility = "hidden";
				//Logica do jogo
			if(vetFrutasMesa.length != 0){
				//console.log(vetFrutasMesa.length);
				for (let index = 0; index < vetFrutasMesa.length; index++) {
					aproximar(vetFrutasMesa[index],vetFrutas3DMesa[index]);
				}
			
			}
				if(podeCair){
					fruta = vetFrutasArv.pop();
					fruta3D = vetFrutasMaca.pop();
					podeCair = false;
				}else{
					if(fruta != null){
						if(!caindo(fruta,fruta3D)){
							vetFrutasMesa.push(fruta);
							vetFrutas3DMesa.push(fruta3D);
							podeCair = true;
						}
					}
				}

		 }
		 gameOver();		
}

function setup()//Chamada quando o jogo comeca
{
  loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		//console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
  };
  
  // Load models
	// REMEMBER: Loading in Javascript is asynchronous, so you need
	// to wrap the code in a function and pass it the index. If you
	// don't, then the index '_key' can change while the model is being
	// downloaded, and so the wrong model will be matched with the wrong
	// index key.
	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
    })(_key);
  }
  //draw();
}

function gerarFloresta(){
	for (let index = 0; index < nArvores; index++) {
		floresta[index] = models.arvore.mesh.clone();
		arvore1 =floresta[index];
		x = getRandomInt(-800,800);
		y = getRandomInt(-800,800);
		while(y < 250 + fieldHeight/2 && y > (-fieldHeight / 2) - 250 && x < (fieldWidth/2)+ 250 ){
			y = getRandomInt(-800,800);
			x = getRandomInt(-800,800);
		}
		
		arvore1.position.x = x;
		arvore1.position.y = y;
		arvore1.position.z = arvore.position.z - 60;
		arvore1.scale.set(7,10,15);
		arvore1.rotation.x = getRandomInt(1,2) * Math.PI /2;
        scene.add(arvore1);
	}

}

var nArvores = 50;
function onResourcesLoaded(){
	gerarFloresta()
	geraFrutas();
	draw();

}

var intAleatorio;
var clock = new THREE.Clock();
// console.log(bola.position.z);
function aproximar(bola,fruta3D){
	// console.log(bola.position.x);
	
	fruta3D.rotation.z += clock.getDelta()*2;
	if(bola.position.x >= -(planeWidth / 2 - raio)){
		bola.position.x -= velX;
		fruta3D.position.x = bola.position.x;
	}else{
		// bola.position.x -= clock.getDelta() * 50;
		bola.position.x -= 0.5;
		fruta3D.position.x = bola.position.x;
		bola.position.z -= velZ;
		fruta3D.position.z = bola.position.z;
		encestou(bola,fruta3D);
		if(bola.position.z <= -80){
			vetFrutasMesa.splice(vetFrutasMesa.indexOf(bola),1);
			vetFrutas3DMesa.splice(vetFrutas3DMesa.indexOf(fruta3D),1);
			scene.remove(bola);
			scene.remove(fruta3D);
	}
	}
}
var divPontos = document.querySelector("#scores");
var divGameOver = document.querySelector("#gameOver");

function encestou(bola,fruta3D){
	if(bola.position.z > cuboCesta.position.z + (cuboCestaProf / 2)-5 && bola.position.z < cuboCesta.position.z + (cuboCestaProf / 2) +5){
		if(bola.position.x < cuboCesta.position.x + cestaLargura/2 && bola.position.x > cuboCesta.position.x - cestaLargura/2 
			&& bola.position.y < cuboCesta.position.y + cestaAltura/2 +7 && bola.position.y > cuboCesta.position.y - cestaAltura/2 -7 ){
				
				vetFrutasMesa.splice(vetFrutasMesa.indexOf(bola),1);
				vetFrutas3DMesa.splice(vetFrutas3DMesa.indexOf(fruta3D),1);
				scene.remove(bola);
				scene.remove(fruta3D);
				//Adicionar pontos
				pontuacao++;
				divPontos.innerHTML = pontuacao;
				return true;

		}
	}else{
		return false;
	}
}


function caindo(fruta,fruta3D){
// console.log(fruta.position.z);
	if(fruta.position.z > plane.position.z + (30/2.0)){
		fruta.position.z -= velZ;
		fruta3D.position.z = fruta.position.z;
		return true;
	}else{
		return false;

	}

}




	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	  }

	  function pausar(){
		if(Key.isDown(Key.P)){
			pausado = !pausado;
		  }

	  }

	  function mudarLuz(){
		if(Key.isDown(Key.L)){
			light.color.setHSL(0.24,1,0.5);
		  }

	  }

	  function gameOver(){
			if(vetFrutas3DMesa.length == 0 && vetFrutasArv.length == 0 && vetFrutasMesa.length == 0){
				if(pontuacao < (nFrutas/3) && pontuacao > 0){
					divGameOver.innerHTML = "Muito bem!";
					
				}
			}

	  }
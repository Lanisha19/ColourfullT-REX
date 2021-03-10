var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trexImage;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;

var score;
var gameOverImg,restartImg

function preload(){
  trexImage = loadImage("trex1.png");
  
  groundImage = loadImage("ground1.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus5.png");
  
  restartImg = loadImage("restart1.png")
  gameOverImg = loadImage("gameover1.png")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,160,20,50);
  trex.addImage("trex", trexImage);
  trex.scale = 0.4;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.scale=3
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,80);
  trex.debug = true
  
  score = 0;
  
 
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(frameRate()/60);
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.6
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
    
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
//when we press the restart button then computer will follow the    instruction given in reset function
  if(mousePressedOver(restart)) {
      reset();
    }

 trex.depth=ground.depth+5
 
  
  drawSprites();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);

    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(15,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
//creating the function to do these things to computer when we press the restart button
function reset(){
  score=0;
  gameOverImg.visibile=false;
  restartImg.visibile=false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  gameState=PLAY;
  
}
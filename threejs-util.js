"use strict";

let isWalkingForward = false;
let isWalkingBackward = false;
let isWalkingLeft = false;
let isWalkingRight = false;
let isFlyingUp = false;
let isFlyingDown = false;

let flyingAllowed = true;
let flyingThreshold = 0.15;
let movingSpeed = 0;
let movingSpeedMax = 0.04;
let movingDelta = 0.002;
let floor = 0;
let gravity = 0.01;
let cameraGaze;
let room;

let tmpQuaternion = new THREE.Quaternion();
let moveVector = new THREE.Vector3( 0, 0, 0 );
let rotationVector = new THREE.Vector3( 0, 0, 0 );

function setupControls() {
    /*
    window.addEventListener("touchstart", function(event) {
        isWalkingForward = true;
    });

    window.addEventListener("touchend", function(event) {
        isWalkingForward = false;
    })
    */
    
    window.addEventListener("keydown", function(event) {
        if (util.getKeyCode(event) === 'w') isWalkingForward = true;
        if (util.getKeyCode(event) === 'a') isWalkingLeft = true;
        if (util.getKeyCode(event) === 's') isWalkingBackward = true;
        if (util.getKeyCode(event) === 'd') isWalkingRight = true;
        if (util.getKeyCode(event) === 'q') isFlyingDown = true;
        if (util.getKeyCode(event) === 'e') isFlyingUp = true;
    });

    window.addEventListener("keyup", function(event) {
        if (util.getKeyCode(event) === 'w') isWalkingForward = false;
        if (util.getKeyCode(event) === 'a') isWalkingLeft = false;
        if (util.getKeyCode(event) === 's') isWalkingBackward = false;
        if (util.getKeyCode(event) === 'd') isWalkingRight = false;
        if (util.getKeyCode(event) === 'q') isFlyingDown = false;
        if (util.getKeyCode(event) === 'e') isFlyingUp = false;
    });

    window.addEventListener("resize", function(event) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );
        composer.setSize( width, height );
    }, false);

    document.addEventListener("mousedown", function(event) {
        //
    }, false);
    
    document.addEventListener("mousemove",  function(event) {
        //
    }, false);
    
    document.addEventListener("mouseup",  function(event) {
        //
    }, false);
    
    document.addEventListener("wheel",  function(event) {
        //
    }, false);
}

function setupPlayer() {
    //cameraGaze = new THREE.Object3D();
    //cameraGaze.position.set(0, 0.1, -60);
    //camera.add(cameraGaze);

    setupControls();
}

function updatePlayer() {
    /*
    if (camera.rotation.x > flyingThreshold) {
        flyingAllowed = true;
    } else {
        flyingAllowed = false;
    }
    */

    //let cameraPos = camera.position.clone();
    //let targetPos = cameraPos.clone();
    //let aimPos = cameraGaze.getWorldPosition();

    if ((isWalkingForward || isWalkingBackward || isWalkingLeft || isWalkingRight || isFlyingUp || isFlyingDown) && movingSpeed < movingSpeedMax) {
        if (movingSpeed < movingSpeedMax) {
            movingSpeed += movingDelta;
        } else if (movingSpeed > movingSpeedMax) {
            movingSpeed = movingSpeedMax;
        }
    } else {
        if (movingSpeed > 0) {
            movingSpeed -= movingDelta;
        } else if (movingSpeed < 0) {
            movingSpeed = 0;
        }
    }

    if (movingSpeed > 0) {
    	if (isWalkingForward) {
            camera.translateZ(-movingSpeed);
    	}

    	if (isWalkingBackward) {
            camera.translateZ(movingSpeed);		
    	} 

    	if (isWalkingLeft) {
    		camera.translateX(-movingSpeed);
    	}

    	if (isWalkingRight) {
            camera.translateX(movingSpeed);
    	}

    	if (isFlyingUp) {
            camera.translateY(movingSpeed);
    	}

    	if (isFlyingDown) {
            camera.translateY(-movingSpeed);
    	}

        //camera.position.set(targetPos.x, targetPos.y, targetPos.z);
        //camera.updateMatrixWorld();
        //camera.lookAt(aimPos);
    }

    /*
    if (!isWalkingForward && camera.position.y > floor) {
        camera.position.y -= gravity;
        if (camera.position.y < floor) camera.position.y = floor;
    }
    */
}



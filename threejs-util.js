"use strict";

function clearScene(obj) {
    while (obj.children.length > 0) { 
        clearScene(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) { 
        // in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop]) {
                return;         
            }
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function') {
                obj.material[prop].dispose();
            }                                                  
        });
        obj.material.dispose();
    }
} 


// ~ ~ ~ ~ ~ ~ ~ ~    KEYBOARD   ~ ~ ~ ~ ~ ~ ~ ~ 
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

    /*
    window.addEventListener("mousedown", function(event) {
        //
    }, false);
    
    window.addEventListener("mousemove",  function(event) {
        //
    }, false);
    
    window.addEventListener("mouseup",  function(event) {
        //
    }, false);
    
    window.addEventListener("wheel",  function(event) {
        //
    }, false);
    */
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

// ~ ~ ~ ~ ~ ~ ~ ~    MOUSE   ~ ~ ~ ~ ~ ~ ~ ~ 

let rotateStart = new THREE.Vector2(window.innerWidth/2, window.innerHeight/2);
let rotateEnd = new THREE.Vector2(0,0);
let rotateDelta = new THREE.Vector2(0,0);
let isDragging = false;
let MOUSE_SPEED_X = 0.5;
let MOUSE_SPEED_Y = 0.3;
let phi = 0;
let theta = 0;

window.addEventListener("mousedown", function(event) {
    rotateStart.set(event.clientX, event.clientY);
    isDragging = true;
});

/*
window.addEventListener("focus", function(event) {
    isDragging = true;
});
*/

// Very similar to https://gist.github.com/mrflix/8351020
window.addEventListener("mousemove", function(event) {
    if (!isDragging && !isPointerLocked()) {
        return;
    }

    // Support pointer lock API.
    if (isPointerLocked()) {
        let movementX = event.movementX || event.mozMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || 0;
        rotateEnd.set(rotateStart.x - movementX, rotateStart.y - movementY);
    } else {
        rotateEnd.set(event.clientX, event.clientY);
    }

    // Calculate how much we moved in mouse space.
    rotateDelta.subVectors(rotateEnd, rotateStart);
    rotateStart.copy(rotateEnd);

    // Keep track of the cumulative euler angles.
    let element = document.body;
    phi += 2 * Math.PI * rotateDelta.y / element.clientHeight * MOUSE_SPEED_Y;
    theta += 2 * Math.PI * rotateDelta.x / element.clientWidth * MOUSE_SPEED_X;

    // Prevent looking too far up or down.
    phi = util.clamp(phi, -Math.PI/2, Math.PI/2);

    let euler = new THREE.Euler(-phi, -theta, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
});

window.addEventListener("mouseup", function(event) {
    isDragging = false;
});

/*
window.addEventListener("blur", function(event) {
    isDragging = false;
});
*/

function isPointerLocked() {
    let el = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
    return el !== undefined;
}

function resetCameraPosition() {
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    phi = 0;
    theta = 0;
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 


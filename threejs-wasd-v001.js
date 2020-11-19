"use strict";

let isWalkingForward = false;
let isWalkingBackward = false;
let isWalkingLeft = false;
let isWalkingRight = false;
let isFlyingUp = false;
let isFlyingDown = false;

let movingSpeed = 0;
let movingSpeedMax = 0.04;
let movingDelta = 0.002;

function setupPlayer() {
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
}

function updatePlayer() {
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
    }
}


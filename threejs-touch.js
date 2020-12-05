"use strict";

// depends on wasd and mouse

function setupTouch() {
    window.addEventListener("touchstart", function(event) {
        isWalkingForward = true;
    });

    window.addEventListener("touchend", function(event) {
        isWalkingForward = false;
    })
}
"use strict";

class Util {

    constructor() {
        //
    }

    lerp(start, end, value){
        return (1 - value) * start + value * end
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    map(s, a1, a2, b1, b2) {
        return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
    }

    millis() {
        return parseInt(now * 1000);
    }

    diceHandler(value) {
        return Math.random() < value;
    }

    random(value) {
        return Math.random() * value;
    }

    randomRange(value1, value2) {
        return this.map(Math.random(), 0, 1, value1, value2);
    }

    randomInt(value) {
        return parseInt(Math.random() * value);
    }

    randomRangeInt(value1, value2) {
        return parseInt(this.map(Math.random(), 0, 1, value1, value2));
    }

    // ~ ~ ~   input   ~ ~ ~ 

    getKeyCode(event) {
        var k = event.charCode || event.keyCode;
        var c = String.fromCharCode(k).toLowerCase();
        return c;
    }

    checkForMouse() {
    	return !window.matchMedia("(any-pointer:coarse)").matches;
    }

    // ~ ~ ~   browser   ~ ~ ~

    checkQueryInUrl(key) {
        let query = window.location.search.substring(1);
        let pairs = query.split("&");
        for (let i=0; i<pairs.length; i++) {
            let pair = pairs[i].split("=");
            if (pair[0] == key) { 
                return true;
            }
        }
        
        return(false);
    }

    getQueryFromUrl(key) {
        let query = window.location.search.substring(1);
        let pairs = query.split("&");
        for (let i=0; i<pairs.length; i++) {
            let pair = pairs[i].split("=");
            if (pair[0] == key) { 
                return pair[1];
            }
        }
        
        return(false);
    }

    setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    checkCookie(cname, cDefaultValue, exDays) {
        let cvalue = getCookie(cname);
        
        if (cvalue != "") {
            return cvalue;
        } else {
            setCookie(cname, cDefaultValue, exDays);
            cvalue = getCookie(cname);
            if (cvalue != "") {
                return cvalue;
            }
        }

        return "";
    }

    saveAsImage() {
        let imgData, imgNode;
        let strMime = "image/jpeg";
        let strDownloadMime = "image/octet-stream";

        try {
            imgData = renderer.domElement.toDataURL(strMime);
            saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
        } catch (e) {
            console.log(e);
            return;
        }
    }

    saveFile(strData, filename) {
        let link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

}

const util = new Util();

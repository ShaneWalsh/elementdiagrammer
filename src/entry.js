// import required stuff here
"use strict";
import {Diagrammer} from "./Diagrammer";
import {Importer} from "./export/importer";
import {Element} from "./elements/element";
import {MouseFunctions} from "./libs/MouseFunctions";

const CircularJSON = require('circular-json');


window.$jq =  require('jquery');
window.jQuery = $jq;
window.importer = new Importer({});

const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;


var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
						   window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame
						   || function(callback) { window.setTimeout(callback,1000/30);}; //moz firefox 4 up, o Opera, ms IE 9, not standardised yet so need

// set constants
window.globe = {
        debug : false, // false in production!
        errorLog : false, // false in production!

      	F1:"F1",
      	T1:"T1",
      	T2:"T2",

        osl: $jq(".canvasContainer").offset().left, // moved to loop
        ost: $jq(".canvasContainer").offset().top,

				$attributesContainer: $jq("#attributesContainer"),
				$createAttributeInput: $jq("#createAttributeInput"),
				$importExportInput: $jq("#importExportInput"),

        isClickListening : true,
        mouseX: 0,
    		mouseY: 0,

				offsetX:0,
				offsetY:0,

      	RADIANCAL: 180/Math.PI,
      	DEGREECAL: Math.PI/180
};

// create required objects.


// animationLoop
function loop() {
    if(globe.isPlaying) { // = true
			// todo, add a few skips in here, or once every five do the draw, or it will try and do too much work.
  		diagrammer.redraw();
      requestAnimFrame(loop); // takes a function as para, it will keep calling loop over and over again
    }
}

function startLoop() {
		//keyboardTravel.pausePressed = false
		globe.isPlaying = true; // loop will start
		globe.isMoveKeysListening = true;
		globe.isClickListening = true;
		loop();
}

function stopLoop() {
		globe.isPlaying = false;
		globe.isMoveKeysListening = false;
		globe.isClickListening = false;
}

function startup(){
  // create listener
  //window.keyboardTravel = new KeyboardTravel();
  //document.addEventListener('keydown', function(e) { keyboardTravel.checkKeyDown(e); }.bind(keyboardTravel),false);
  //document.addEventListener('keyup',function(e) {  keyboardTravel.checkKeyUp(e); }.bind(keyboardTravel),false);

  window.mouseFunctions = new MouseFunctions();
  document.getElementById('gcc').addEventListener("mousemove", mouseFunctions.updateMousePosition.bind(mouseFunctions), false);
  document.getElementById('gcc').addEventListener("dblclick", mouseFunctions.doubleClick.bind(mouseFunctions), false);
  document.getElementById('gcc').addEventListener("mousedown", mouseFunctions.mouseClick.bind(mouseFunctions), false);
  document.getElementById('gcc').addEventListener("mouseup", mouseFunctions.mouseClickRelease.bind(mouseFunctions), false);
  document.getElementById('gcc').addEventListener("contextmenu", mouseFunctions.rightClickContext.bind(mouseFunctions), false);

  //document.getElementById().addEventListener("hover", mouseFunctions.onmouseover.bind(mouseFunctions), false);

  // buttons for clicking.
  document.getElementById('createElement').addEventListener("click", diagrammer.createElement.bind(diagrammer), false);
  document.getElementById('copyElement').addEventListener("click", diagrammer.copyElement.bind(diagrammer), false);
  document.getElementById('removeSelected').addEventListener("click", diagrammer.removeSelected.bind(diagrammer), false);
  document.getElementById('clearSelectedConnections').addEventListener("click", diagrammer.clearSelectedConnections.bind(diagrammer), false);
  document.getElementById('recenter').addEventListener("click", diagrammer.recenter.bind(diagrammer), false);
  //document.getElementById('createConnection').addEventListener("click", createConnection, false);

  // start canvas drawing loop.
  startLoop();
}


let canvas = document.getElementById('canvasDiagrammer');
window.diagrammer = new Diagrammer({canvas});
startup();

// do we have anything to load?


// nothing to load, just display an empty canvas.
diagrammer.redraw({});

// when there is a click, the diagrammer should be informed. :S



window.getMouseXOffset = function(){
	return globe.mouseX - globe.offsetX;
}

window.getMouseYOffset = function(){
	return globe.mouseY - globe.offsetY;
}

///////////////////////////// Front end JS Hooks  //////////////////////////
/**
 * Pushes change event triggered in the frontend to the diagrammer.
 */
window.attributeChanged = function(e, elementId, attributeId, value){
		diagrammer.updateAttribute({elementId, attributeId, value:$jq(e.target).val()});
		//alert(`elementId:${elementId} attributeId:${attributeId} value:${value}`);
}

window.addAttribute = function(){
		diagrammer.addAttribute({label:globe.$createAttributeInput.val()});
		//alert(globe.$createAttributeInput.val());
}

window.rmAttribute = function(elementId, attributeId){
		diagrammer.rmAttribute({elementId, attributeId});
}

window.importConfig= function(){
	let config = globe.$importExportInput.val();
	let elements = importer.importDiagram({json:config});
	diagrammer.props.elements = elements;
	diagrammer.redraw({});
}

window.exportConfig= function(){
	// get the config data from the diagrammer
	globe.$importExportInput.val(CircularJSON.stringify(diagrammer.props.elements));
}

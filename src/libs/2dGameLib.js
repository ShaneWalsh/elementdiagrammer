/*
 *  Created by Shane Walsh
 *
 */

export function Create2DArray(rows) { // export function to create a new 2d array of size inputed/ really an array of arrays
  var gridA = [];

  for (var i=0;i<rows;i++) {
     gridA[i] = [];
  }

  return gridA;
}

export function drawPath(x,y,xx,yy,color,ctx){
	ctx.beginPath();
    ctx.moveTo(x+32, y+32);
    ctx.lineTo(xx, yy);
	ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawLine(x,y,xx,yy,color,ctx){
	ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
	ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawBorder(x,y,sizeX,sizeY,ctx,color){
    ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.strokeRect(x+1,y+1,sizeX,sizeY);
}

export function drawBorderRotate(x,y,sizeX,sizeY,ctx,color, rotation, translateX, translateY){
	translateX = (0.5 + translateX) << 0;
    translateY = (0.5 + translateY) << 0;

    ctx.save();
    ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
    ctx.rotate(rotation);
    ctx.translate(translateX*-1, translateY *-1); // this moves the point of drawing and rotation to the center.

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.strokeRect(x+1,y+1,sizeX,sizeY);

    ctx.restore();
}

export function drawBox(x,y,sX,sY,ctx,colour,colour2){
	ctx.lineWidth = 2;
       // ctx.save();
        //ctx.rotate(45*Math.PI/180);
	ctx.fillStyle = colour;
	ctx.fillRect(x, y, sX, sY);

	ctx.strokeStyle = colour2;
	ctx.strokeRect(x,y,sX,sY);
        //ctx.restore();
       // ctx.rotate(-45*Math.PI/180);
}

export function drawRoundRect(x, y, w, h, r, ctx, colour, colour2) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.strokeStyle = colour2;
  ctx.stroke();
}

export function DrawImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image){
	ctx.drawImage(image,x,y,sx,sy,lx,ly,lxs,lys); // l are for the actual canvas positions, the s values are for the sprite sheet locations.
	//drawBorder(lx,ly,lxs,lys,window.ctxNPC,"#FF0000"); // uncomment for debugging sprites
}



export function DrawRotateImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image, rotation, translateX,translateY ){ // l are the actual canvas positions

	// bitwise transformations to remove floating point values, canvas drawimage is faster with integers
	lx = (0.5 + lx) << 0;
	ly = (0.5 + ly) << 0;

	translateX = (0.5 + translateX) << 0;
	translateY = (0.5 + translateY) << 0;

	ctx.save();
	ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
	ctx.rotate(rotation);
	ctx.translate(translateX*-1, translateY *-1); // this moves the point of drawing and rotation to the center.
	DrawImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image); // create new method, draw image with rotation.
	//window.ctxNPC.rotate(rotation*-1);
	ctx.restore();

	//drawBorder(lx,ly,lxs,lys,window.ctxNPC,"#FF0000"); // uncomment for debugging sprites
}

export function DrawPreRenderSprite(name,lx,ly,lxs,lys,ctx, rotation){ // l are the actual canvas positions
	// bitwise transformations to remove floating point values, canvas drawimage is faster with integers
	lx = (0.5 + lx) << 0;
	ly = (0.5 + ly) << 0;
    let prSprite = pRS.props.preRenderedSprites[name];
    let canvas = prSprite.arr[radianToDegreeFloor(rotation)];
    ctx.drawImage(canvas,prSprite.locX,prSprite.locY,prSprite.sizeX,prSprite.sizeY,lx,ly,lxs,lys); // I need to account for the rotation in the display!
}

export function createPreRenderCanvas(sizeX, sizeY){ // offscreen canvases for double buff
    var pre_canvas = document.createElement('canvas');
    pre_canvas.width = sizeX;
    pre_canvas.height = sizeY;
    return pre_canvas;
}

export function write(x,y,text,size,color1,ctx){
	ctx.font = size + "px 'Century Gothic'"; // Supertext 01
	ctx.fillStyle = color1;
	ctx.fillText(text, x, y);
	//ctx.fill();
}


export function getString(string1){
var string=prompt(string1);
return string;
}

export function gridPositions(x,y){
	this.x = x;
	this.y = y;
}



///////////////////////// Manual Word processing

export function createWord(x,y,text,ctx){
// count the size of the word, see if it will fit into the available space

// upper case characters

// get character code, get the size, and the spritesheetname
}
export function WriteInPixels(x,y,text,ctx){
	// First, work out how far
	ctx.font = size + "px 'Century Gothic'";
	ctx.fillStyle = color1;
	ctx.fillText(text, x, y);
	//ctx.fill();
	//charCodeAt(0);
}

export function pointInsideSprite(point, sprite) {
	// original solution / seemed to result in some misses
	if(point.x > sprite.props.x && point.x < (sprite.props.x+sprite.props.width) ){
		if(point.y > sprite.props.y && point.y < (sprite.props.y+sprite.props.height)){
			return true;
		}
	}

}

export function doBoxesIntersect(a, b) {
	// original solution / seemed to result in some misses
 // return (absVal(a.props.x - b.props.x) * 2 < (a.props.width + b.props.width)) &&
 //        (absVal(a.props.y - b.props.y) * 2 < (a.props.height + b.props.height));
	return areCentersToClose(a,b);
}

export function doBoxesIntersectRotation(a, b) { // take the angle from the elements
  return (absVal(a.props.x - b.props.x) * 2 < (a.props.width + b.props.width)) &&
         (absVal(a.props.y - b.props.y) * 2 < (a.props.height + b.props.height));
}

//http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
// if you ever want to do it right :p

export function areCentersToClose(a, b) {
  return (absVal( (a.props.x+(a.props.width >> 1))  - (b.props.x + (b.props.width >> 1)) ) < ((a.props.width >>1) + (b.props.width >> 1))) &&
         (absVal( (a.props.y+(a.props.height >> 1))  - (b.props.y + (b.props.height >> 1)) ) < ((a.props.height >> 1) + (b.props.height >> 1)));
}

export function absVal(val) {
  return (val < 0) ? -val : val;
}

export function totalDistance(objA,objB){ // I could center values to be exact, but not required, this will be faster.
    var total = absVal(objA.props.x - objB.props.x);
    total += absVal(objA.props.y - objB.props.y);
    return total;
}



// calculate the position of a point after rotation
// can be used for finding the points on a rectangle after rotation if required if I ever implement correct collision detection
// ill just use it to make missiles spawn in the correct location.
// maybe I should use lookup tables for the cos and the sin, I dont think I need it to be perfectly accurate and it would save processing time.
// http://stackoverflow.com/questions/12161277/how-to-rotate-a-vertex-around-a-certain-point/
export function pointAfterRotation(centerX,centerY,point2X, point2Y, angle){
	//let cosX = absVal(Math.cos(angle));
	//let sinX = absVal(Math.sin(angle));

	/*
	let cosX = Math.cos(angle);
	let sinX = Math.sin(angle);

	let newX = 0;//centerX + ( cosX * (point2X-centerX) + sinX * (point2Y -centerY))
	let newY = 0;

	if(sinX < 0){
		if(cosX > 0){
			newY= centerY + ( sinX * (point2X-centerX) + cosX * (point2Y -centerY))
			newX= centerX + ( cosX * (point2X-centerX) + -sinX * (point2Y -centerY))
		}
		else{ // sinX < 0 && cosX < 0
			newY= centerY + ( -sinX * (point2X-centerX) + cosX * (point2Y -centerY))  // there used to be just a -cos here, but it stopped working in some cases, seems to be fine now.
			newX= centerX + ( cosX * (point2X-centerX) + -sinX * (point2Y -centerY))
		}
	}
	else if(cosX < 0){ // && sinX > 0
		newY= centerY + ( -sinX * (point2X-centerX) + cosX * (point2Y -centerY))
		newX= centerX + ( cosX * (point2X-centerX) + -sinX * (point2Y -centerY))
	}
	else{ //(cosX > 0 && sinX > 0){
		newY= centerY + ( sinX * (point2X-centerX) + cosX * (point2Y -centerY))
		newX= centerX + ( cosX * (point2X-centerX) + -sinX * (point2Y -centerY))
	}

	*/

	//http://stackoverflow.com/questions/22491178/how-to-rotate-a-point-around-another-point
	var x1 = point2X - centerX;
    var y1 = point2Y - centerY;

    var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

    var newX = x2 + centerX;
    var newY = y2 + centerY;

	return {x:newX,y:newY}; // so i can drop it straight into assignments

	// if the object is i not appearing in the correct point, ensure u are using the correct point for rotation, for bullets it should be the top left, not middle.
}



// radians = degrees * (pi/180)
//degrees = radians * (180/pi)
//turns radians, like the ones you get from atan2 into dregees
export function radianToDegree(radians){
	var deg = radians * globe.RADIANCAL;
	if(deg < 0){
	    return deg+360;
	}
	else{
        return deg;
    }
}

export function radianToDegreeFloor(radians){
	return Math.floor(radianToDegree(radians))
}

export function degreeToRadian(degrees){
	return degrees * globe.DEGREECAL;
}






var words_alphabet = {
	65:[], // a
	66:[],
	67:[],
	68:[],
	69:[],
	70:[],
	71:[],
	72:[],
	73:[],
	74:[],
	75:[],
	76:[],
	77:[],
	78:[],
	79:[],
	80:[],
	81:[],
	82:[],
	83:[],
	84:[],
	85:[],
	86:[],
	87:[],
	88:[],
	89:[],
	90:[],
	190:[], // full stop
	63:[] // Question Mark

	// 0	48
// 1	49
// 2	50
// 3	51
// 4	52
// 5	53
// 6	54
// 7	55
// 8	56
// 9	57


}

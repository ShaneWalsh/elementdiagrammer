// import required stuff here
"use strict";
import {Create2DArray,drawLine,drawBox,drawBorder,Write,absVal,createPreRenderCanvas,pointInsideSprite} from "./libs/2dGameLib";
import {Element} from "./elements/element";
import {Connection} from "./elements/connection";

/**
 *
 */
export class Diagrammer{
  constructor({canvas}){
      this.props = {
           canvas,
           elements:{},
           connections:{},
           elementSelected:undefined,
           leftClicked: false,
           rightClicked: false,
           drawLineMode: undefined,
           // positioning, distance from x+y to mouse x+y when clicked. So i know where to drop it when released.
           distanceX:0,
           distanceY:0,
    };
  }

/**
 * Clear the cnavas and redraw everything.
 */
  redraw(){
    let p = this.props;
		// take as long as necessary.
    let ctx = p.canvas.getContext('2d');
    ctx.clearRect(0, 0, 10000, 10000);

    // updated any selected elementSelected
    this.updateSelectedElement();

    // draw all elements
    for (let key in p.elements) {
			if (p.elements.hasOwnProperty(key)) {
        if(p.elements[key] == p.elementSelected){
            p.elements[key].draw({ctx, highlightConnections:true});
        }
        else{
          p.elements[key].draw({ctx});
        }
      }
    }
    for (let key in p.elements) {
			if (p.elements.hasOwnProperty(key)) {
        if(p.elements[key] == p.elementSelected){
            p.elements[key].drawConnections({ctx, highlightConnections:true});
        }
        else{
          p.elements[key].drawConnections({ctx});
        }
      }
    }

    if(p.drawLineMode == true){
      // draw a line from selected element to the mouse x and y
      drawLine(p.elementSelected.getXOffset(), p.elementSelected.getYOffset(), globe.mouseX,globe.mouseY, '#000000',ctx);
    }

  }

/**
 * Called anytime an attribute changes, updating its primary object.
 * elementId is actually an internal eTimestamp id used by diagrammer, cannot be changed once an element is created.
 */
  updateAttribute({elementId,attributeId,value}){
     let p = this.props;
     if(p.elements[elementId].props[attributeId] != undefined){
        p.elements[elementId].props[attributeId] = value;
     }
     else if(p.elements[elementId].props.attributes[attributeId] != undefined){
        p.elements[elementId].props.attributes[attributeId] = value;
     }
  }

/**
 * Called anytime an attribute changes, updating its primary object.
 * elementId is actually an internal eTimestamp id used by diagrammer, cannot be changed once an element is created.
 */
  addAttribute({label}){
     let p = this.props;
     if(p.elementSelected !== undefined){
       p.elementSelected.props.attributes[label] = "unset";
       this.updateEditableFields();
     }
  }

/**
 * Called from the frontend to remove an attribute from an element
 */
  rmAttribute({elementId, attributeId}){
     let p = this.props;
     if(p.elementSelected !== undefined){
       if(p.elements[elementId].props.attributes[attributeId] != undefined){
          delete p.elements[elementId].props.attributes[attributeId];
       }
       this.updateEditableFields();
     }
  }

/**
 * if there is a selected element update it so the canvas can redraw it properly.
 * called from animation loop.
 */
  updateSelectedElement(){
    let p = this.props;
    if(p.elementSelected !== undefined && p.leftClicked == true){
      p.elementSelected.setCords({x:(p.distanceX+getMouseXOffset()),y:(p.distanceY+getMouseYOffset())});
      // TODO if ctrl is also pressed then we should be updating all ofs children aswell. in primary direction.
    }
  }

  /**
   * Spawns a new element and adds it to the elements
   * redraw
   */
  createElement(){
    let p = this.props;
    let id = "e"+new Date().getTime();

    // TODO adjust for screen navigation offset in the x and y.
    // and calc the middle.
    let element = new Element({id, x:(100-globe.offsetX), y:(100-globe.offsetY)});
    p.elements[id] = element;
  }

  /**
   * Spawns a new element that is a copy of the selected elment minus the connections.
   * redraw
   */
  copyElement(){
    let p = this.props;
    for (let key in p.elements) {
			if (p.elements.hasOwnProperty(key)) {
        if(p.elements[key] == p.elementSelected){
            let elementToCopy = p.elements[key];
            let id = "e"+new Date().getTime();

            // TODO adjust for screen navigation offset in the x and y.
            // and calc the middle.
            let element = new Element({id, x:(100-globe.offsetX), y:(100-globe.offsetY),color:elementToCopy.props.color,bgColor:elementToCopy.props.bgColor, shape:elementToCopy.props.shape});
            p.elements[id] = element;
        }
      }
    }
  }  
  
  /**
   * Removes an elements connections, and then removes the element.
   * redraw
   */
  removeSelected(){
    let p = this.props;
    let selected = this.getSelected();
    selected.clearConnections();
    delete p.elements[selected.props.id]
  }

  /**
   * Removes an elements connections, and then removes the element.
   * redraw
   */
  clearSelectedConnections(){
    let selected = this.getSelected();
    selected.clearConnections();
  }

  getSelected(){
    return this.props.elementSelected;
  }

/**
 * if none is selected, try to select an element
 */
  leftClick(){
    let p = this.props;
    p.drawLineMode = false;// stop connection drawing please.
    loop:
    for (let key in p.elements) {
			if (p.elements.hasOwnProperty(key)) {
        if(pointInsideSprite({x:getMouseXOffset(),y:getMouseYOffset()},p.elements[key])){
          p.elementSelected = p.elements[key];
          this.updateEditableFields();
          p.distanceX = p.elementSelected.props.x - getMouseXOffset();
          p.distanceY = p.elementSelected.props.y - getMouseYOffset();
          p.leftClicked = true;
          break loop;
        }
        // TODO check if it interects any of the selected elements connection boxes.
        // TODO if yes, remove the connection from both elements.
      }
    }
  }

  rightClick(){
    let p = this.props;
    p.rightClicked = true;
    if(p.elementSelected !== undefined){
      // on second right click if over a different element, create a connection.
      if(p.drawLineMode == true){
        loop:
        for (let key in p.elements) {
    			if (p.elements.hasOwnProperty(key)) {
            if(pointInsideSprite({x:getMouseXOffset(),y:getMouseYOffset()},p.elements[key])){
              if(p.elements[key] != p.elementSelected){
                // create a connection between these two elements
                let tempId = p.elementSelected.props.id + p.elements[key].props.id+"Connection";
                let connection = new Connection({id:tempId, sourceElement:p.elementSelected, targetElement:p.elements[key]})
                p.elementSelected.addSourceConnection({connection});
                p.elements[key].addTargetConnection({connection});
                // selected element is the primary
                p.drawLineMode = false;
                break loop;
              }
            }
          }
        }
      }
      else{ // if we are over an element, start drawing a line
        p.drawLineMode = true;
      }
    }
  }

  leftClickRelease(){
    let p = this.props;
    this.updateSelectedElement();
    if(p.elementSelected !== undefined){
      // on left click we release the selected element.
      p.leftClicked = false;
      // We dont remove this because we want to be able to update its weapons.
      //p.elementSelected = undefined;
    }
  }

  rightClickRelease(){
    let p = this.props;
    p.rightClicked = false;
  }

  /**
   * delete the old editable fields and replace them with the new selected element
   *
   */
  updateEditableFields(){
    let p = this.props;
    let attrib = "";
    if(p.elementSelected !== undefined){
      // element direct on element values
      let dataMap = p.elementSelected.props
      let elementId = p.elementSelected.props.id
      for (let key in dataMap) {
  			if (dataMap.hasOwnProperty(key)) {
          if(key == "title"){
            let value = dataMap[key];
            attrib += `<span>${key}:
              <input rows="1" cols="36" onchange="return attributeChanged(event,'${elementId}','${key}','${value}');" value="${value}"></input>
            </span>`
          } else if(key == "color" || key == "bgColor"){
            let value = dataMap[key];
            attrib += `<span>${key}:
                        <select onchange="return attributeChanged(event,'${elementId}','${key}','${value}');">
                          <option value="#000000" ${(value == '#000000')?"selected":""}>Black</option>
                          <option value="#FEFEFE"  ${(value == '#FEFEFE')?"selected":""}>White</option>
                          <option value="#FF0000"  ${(value == '#FF0000')?"selected":""}>Red</option>
                          <option value="#00FF00"  ${(value == '#00FF00')?"selected":""}>Green</option>
                          <option value="#0000FF"  ${(value == '#0000FF')?"selected":""}>Blue</option>
                        </select>
                      </span>`
          } else if(key == "shape"){ // todo make this a select list
            let value = dataMap[key];
            attrib += `<span>${key}:
                        <select onchange="return attributeChanged(event,'${elementId}','${key}','${value}');">
                          <option value="rect" ${(value == 'rect')?"selected":""}>Rectangle</option>
                          <option value="roundedRect"  ${(value == 'roundedRect')?"selected":""}>Rounded Rect</option>
                        </select>
                      </span>`
          }
        }
      }
      // todo add tags. // could define what the posible tags are.
        // e.g multi, allplay, etc
      // element attributes
      dataMap = p.elementSelected.props.attributes
      for (let key in dataMap) {
  			if (dataMap.hasOwnProperty(key)) {
          let value = dataMap[key];
          attrib += `<span><button onclick="rmAttribute('${elementId}','${key}')">X</button>${key}:
          <textarea rows="1" cols="36" onchange="return attributeChanged(event,'${elementId}','${key}','${value}');">${value}</textarea>
          </span>`
        }
      }
    }
    globe.$attributesContainer.html(attrib);
  }

  /**
   * Checks if the mouse is in the sides of the canvas, if it is in those zones
   * then increase or decrease the value.
   */
  checkIfInHoverCorners(){
    // width and height
    let width = this.props.canvas.width;
    let height = this.props.canvas.height;

    var bound = 20;
    var amount = 10;

    if(globe.mouseX < bound){
      globe.offsetX+=amount;
    }
    else if(globe.mouseX > (width-bound)){
      globe.offsetX-=amount;
    }

    if(globe.mouseY < bound){
      globe.offsetY+=amount;
    }
    else if(globe.mouseY > (height-bound)){
      globe.offsetY-=amount;
    }

    console.log("X:"+globe.offsetX +" Y:"+globe.offsetY);
  }

  /**
   * Recenters the user back at the original starting drawing point.
   */
  recenter(){
    globe.offsetX = 0;
    globe.offsetY = 0;
  }

}

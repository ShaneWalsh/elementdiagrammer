
import {drawBox,drawBorder,write,drawLine, drawRoundRect} from "../libs/2dGameLib";

/**
 Identifier{id of sorts}
 Box type.{main:square/rect/circle/diamond ,corners:rounded/edged}
 title {size, color:black, backgroundColor, content}
 subsection/s {separator type:blank/line/dotted/etc, content}
 connections{connectionPointFrom, connectionPointTo(identifier, connectionPoint on element)}
 hide element {boolean} (when hidden, the element title should be shown at the top as an unhide toggle.)
 class (is there a class it should take its default values from) Optional
 */
export class Element{
    constructor({id, x, y, title=id, attributes={}, width=(title.length*10), height=30, color="#000000",bgColor="#FEFEFE", shape="rect"}){
        this.props = {
			       id,
             x,
             y,
             width,
             height,
             title,
             attributes,
             color,
             bgColor,
             shape,
             sourceConnections:{},
             targetConnections:{},
		  };
    }

  getCords(){
    let p = this.props;
    return[{x:p.x,y:p.y},{x:p.x+p.width,y:p.y},{x:p.x,y:p.y+p.height},{x:p.x+p.width,y:p.y+p.height}]
  }

  /**
   * Called whenever there is an update to the dia
   */
  draw({ctx, highlightConnections=false, showAttributes=false}){
    let p = this.props;

    let x = p.x + globe.offsetX;
    let y = p.y + globe.offsetY;
    let col = (highlightConnections)?'#FE0000':p.color; // then mark it has target being highlighted.
    if(p.shape=="roundedRect"){
      console.log("rounded!");
      drawRoundRect(x,y,p.width,p.height,20,ctx,p.bgColor,col);
    } else {
      drawBox(x,y,p.width,p.height,ctx,p.bgColor,col);
    }


    write(x+10,y+15,p.title,12,p.color,ctx);

    //this.drawConnections();
  }

  drawConnections({ctx, highlightConnections=false, showAttributes=false}){
    let p = this.props;
    for (let key in p.sourceConnections) {
      if (p.sourceConnections.hasOwnProperty(key)) {
        if(p.sourceConnections[key]){
          // draw the line
          p.sourceConnections[key].draw({ctx,highlightConnections});
          if(highlightConnections){
            //TODO then when drawing the connections where its the primary
            //TODO add clickable boxes along the line, that when clicked, remove the line.
          }
        }
      }
    }
    if(showAttributes == true){
      // display attributes.
    }
  }

  getXOffset(){
    return this.props.x + globe.offsetX;
  }

  getYOffset(){
    return this.props.y + globe.offsetY;
  }

  setCords({x,y}){
    this.props.x =x;
    this.props.y =y;
  }

  addAttribute({name,value}){
    let p = this.props;
    if(p.attributes[name] === undefined){
      p.attributes[name] = value;
    }
  }

  addSourceConnection({connection}){
    let p = this.props;
    p.sourceConnections[connection.props.id] = connection;
  }

  removeSourceConnection(connection){
    let p = this.props;
    delete p.sourceConnections[connection.props.id];
  }

  addTargetConnection({connection}){
    let p = this.props;
    p.targetConnections[connection.props.id] = connection;
  }

  removeTargetConnection(connection){
    let p = this.props;
    delete p.targetConnections[connection.props.id];
  }

  // remove all of the target and source connections from other nodes.
  clearConnections(){
    let p = this.props;
    for (let key in p.sourceConnections) {
			if (p.sourceConnections.hasOwnProperty(key)) {
        let connection = p.sourceConnections[key];
        // find this connection in the targets target connections, and remove it from there.
        if(connection)
        connection.props.targetElement.removeTargetConnection(connection);
      }
    }
    for (let key in p.targetConnections) {
			if (p.targetConnections.hasOwnProperty(key)) {
        let connection = p.targetConnections[key];
        if(connection)
        connection.props.sourceElement.removeSourceConnection(connection);
      }
    }
    p.sourceConnections = {};
    p.targetConnections = {};
  }
}

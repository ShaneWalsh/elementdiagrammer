
import {drawLine} from "../libs/2dGameLib";



// should have points optional. between the start and end points I mean.
// should turn red if invalid. must be connected to two elements.


/**
 * defines the connection between two elements
 */
export class Connection{
    constructor({id, sourceElement, targetElement }){
        this.props = {
		       id,
           // if these are defined, then use them, else use the x and y for the line.
           sourceElement, //primary
           targetElement,
           attributes:{},
		  };
    }

  /**
   * Called whenever there is an update to the dia
   */
  draw({ctx, highlightConnections=false}){
    let p = this.props;
    let x1 = p.sourceElement.props.x + globe.offsetX;
    let y1 = p.sourceElement.props.y + globe.offsetY;
    let x2 = p.targetElement.props.x + globe.offsetX;
    let y2 = p.targetElement.props.y + globe.offsetY;
    // get the closest corners
    let sourceCords = p.sourceElement.getCords();
    let targetCords = p.targetElement.getCords();
    let closestDistance = undefined;
    for(let sCord of sourceCords){
      for(let tCord of targetCords){
        let xDis = (sCord.x - tCord.x);
        let yDis = (sCord.y - tCord.y);
        xDis = (xDis < 0)?xDis*-1:xDis;
        yDis = (yDis < 0)?yDis*-1:yDis;
        let dis = xDis+yDis;
        if(!closestDistance){
          closestDistance = dis;
        } else if(closestDistance > dis){
          closestDistance = dis;
          x1 = sCord.x + globe.offsetX;
          y1 = sCord.y + globe.offsetY;
          x2 = tCord.x + globe.offsetX;
          y2 = tCord.y + globe.offsetY;
        }
      }
    }

    //drawLine(x1+15, y1+15, x2+15, y2+15, '#000000',ctx);
    let color = (highlightConnections)?'#FF0000':'#000000';
    this.drawLineWithArrows(ctx,x1, y1, x2, y2,5,8, color,false,true);
    // display attributes.
  }

  /*
   * Originally Taken from the web, https://riptutorial.com/html5-canvas/example/18136/line-with-arrowheads
   * Added Color setting
   * x0,y0: the line's starting point
   * x1,y1: the line's ending point
   * width: the distance the arrowhead perpendicularly extends away from the line
   * height: the distance the arrowhead extends backward from the endpoint
   * arrowStart: true/false directing to draw arrowhead at the line's starting point
   * arrowEnd: true/false directing to draw arrowhead at the line's ending point
   */
  drawLineWithArrows(ctx,x0,y0,x1,y1,aWidth,aLength,color,arrowStart,arrowEnd){
    var dx=x1-x0;
    var dy=y1-y0;
    var angle=Math.atan2(dy,dx);
    var length=Math.sqrt(dx*dx+dy*dy);
    //
    ctx.translate(x0,y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(length,0);
    if(arrowStart){
        ctx.moveTo(aLength,-aWidth);
        ctx.lineTo(0,0);
        ctx.lineTo(aLength,aWidth);
    }
    if(arrowEnd){
        ctx.moveTo(length-aLength,-aWidth);
        ctx.lineTo(length,0);
        ctx.lineTo(length-aLength,aWidth);
    }
    //
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.setTransform(1,0,0,1,0,0);
  }
}

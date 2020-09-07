/*
 *  Created by Shane Walsh
 *
 */

// on mouse over
//
export class MouseFunctions{
  constructor(){

  }
  updateMousePosition(e){
		globe.mouseX =  Math.floor(e.pageX - globe.osl); // moved to loop
		globe.mouseY =  Math.floor(e.pageY - globe.ost);
		// globe.mouseX =  Math.floor(e.pageX); // moved to loop
		// globe.mouseY =  Math.floor(e.pageY);
    diagrammer.checkIfInHoverCorners();
	}
  
  onmouseover(e){
    diagrammer.checkIfInHoverCorners();
	}

	mouseClick(e){
    if(globe.isClickListening === true){
			if(e.button == 0){
				//pSub.publish(globe.LEFTCLICK,{});
        console.log("CLick:" + globe.mouseX + " : "+globe.mouseY);
        this.updateMousePosition(e);
        diagrammer.leftClick();
			}
			else if(e.button == 2){
				//pSub.publish(globe.RIGHTCLICK,{});
        this.updateMousePosition(e);
        diagrammer.rightClick();
			}
    }
  }

	mouseClickRelease(e){
		if(globe.isClickListening === true){
			if(e.button == 0){ // left
				//pSub.publish(globe.LEFTCLICKRELEASE,{});
        this.updateMousePosition(e);
        diagrammer.leftClickRelease();
			}
			else if(e.button == 2){ // right
				//pSub.publish(globe.RIGHTCLICKRELEASE,{});
        this.updateMousePosition(e);
        diagrammer.rightClickRelease();
			}
    }
  }

	rightClickContext(e){ // this is just a catch for the context menu, to prevent it from appearing.
		e.preventDefault();
	}

	doubleClick(e){
    if(globe.isClickListening === true){
		    //pSub.publish(globe.DOUBLECLICK,{});
    }
  }

}

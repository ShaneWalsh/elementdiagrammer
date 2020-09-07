
import {drawBox,drawBorder,write,drawLine} from "../libs/2dGameLib";
import {Element} from "../elements/element";
import {Connection} from "../elements/connection";
const CircularJSON = require('circular-json');

/**
 * take json and build elements and connections.
 */
export class Importer{
    constructor({}){
        this.props = {
          elements:{}
		  };
    }

/**
  {"e1528739872223":{"props":{"id":"e1528739872223","x":113,"y":391,"width":140,"height":30,"title":"e1528739872223","attributes":{"defaultText":"ufdsf"},"sourceConnections":{"e1528739872223e1528739874664Connection":{"props":{"id":"e1528739872223e1528739874664Connection","sourceElement":"~e1528739872223","targetElement":{"props":{"id":"e1528739874664","x":162,"y":159,"width":140,"height":30,"title":"e1528739874664","attributes":{"defaultdfs":"dfdsf"},"sourceConnections":{},"targetConnections":{"e1528739872223e1528739874664Connection":"~e1528739872223~props~sourceConnections~e1528739872223e1528739874664Connection"}}},"attributes":{}}}},"targetConnections":{"e1528739890464e1528739872223Connection":{"props":{"id":"e1528739890464e1528739872223Connection","sourceElement":{"props":{"id":"e1528739890464","x":285,"y":274,"width":140,"height":30,"title":"e1528739890464","attributes":{},"sourceConnections":{"e1528739890464e1528739872223Connection":"~e1528739872223~props~targetConnections~e1528739890464e1528739872223Connection"},"targetConnections":{}}},"targetElement":"~e1528739872223","attributes":{}}}}}},"e1528739874664":"~e1528739872223~props~sourceConnections~e1528739872223e1528739874664Connection~props~targetElement","e1528739890464":"~e1528739872223~props~targetConnections~e1528739890464e1528739872223Connection~props~sourceElement"}
*/
  importDiagram({json}){
    let p = this.props;
    p.elements = {};
    var config = CircularJSON.parse(json);
    for (let key in config) {
      if (config.hasOwnProperty(key)) { // create elements, all of them
          //console.log(config[key]);
          let element = new Element(config[key].props);
          p.elements[element.props.id] = element;
      }
    }
    for (let configKey in config) { // now create the connections between the elements
      if (config.hasOwnProperty(configKey)) {
        let sourceConnections = config[configKey].props.sourceConnections;
        for (let key in sourceConnections) {
          if (sourceConnections.hasOwnProperty(key)) {
            p.elements[configKey].props.sourceConnections[sourceConnections[key].props.id] = new Connection({id:sourceConnections[key].props.id,
              sourceElement:p.elements[sourceConnections[key].props.sourceElement.props.id],
              targetElement:p.elements[sourceConnections[key].props.targetElement.props.id]});
          }
        }
        let targetConnections = config[configKey].props.targetConnections;
        for (let key in targetConnections) {
          if (targetConnections.hasOwnProperty(key)) {
            p.elements[configKey].props.targetConnections[targetConnections[key].props.id] = new Connection({id:targetConnections[key].props.id,
              sourceElement:p.elements[targetConnections[key].props.sourceElement.props.id],
              targetElement:p.elements[targetConnections[key].props.targetElement.props.id]});
          }
        }
      }
    }
    return p.elements;
  }

}

import {IConverter} from "./IConverter";

export class ResponseConverter implements IConverter {
	
	private Entity: FunctionConstructor;
	
	constructor(Entity: FunctionConstructor) {
		
		this.Entity = Entity;
		
	}
	
	convert(object: Object): Object {
		
		let entity = new this.Entity();
		
		for (let property in entity) {
			
			entity[property] = entity[property];
			
		}
		
		return entity;
		
	}
	
}
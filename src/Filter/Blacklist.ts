/// <reference path="IFilter.ts" />

module arekzc.resource.filter {
	
	export class Blacklist implements IFilter {
		
		private fields: Array<string>;
		
		constructor(fields: Array<string>) {
			
			this.fields = fields;
			
		}
		
		public filter(object: Object): Object {
			
			let result = {};
			
			for (let prop in object) {
				
				if (object.hasOwnProperty(prop) && this.fields.indexOf(prop) === -1) {
					
					result[this.fields[prop]] = object[this.fields[prop]];
					
				}
				
			}
			
			return result;
			
		}
		
	}
	
}
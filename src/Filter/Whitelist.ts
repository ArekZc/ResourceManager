import {IFilter} from './IFilter';

export class Whitelist implements IFilter {
	
	private fields: Array<string>;
	
	constructor(fields: Array<string>) {
		
		this.fields = fields;
		
	}
	
	public filter(object: any): Object {
		
		let result = {};
		
		for (let i = 0; i < this.fields.length; i++) {
				
			result[this.fields[i]] = object[this.fields[i]];
				
		}
		
		return result;
		
	}
	
}
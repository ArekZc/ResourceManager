import {IGenerator} from "./IGenerator";

export class UrlGenerator implements IGenerator {
	
	private route: string;
	
	constructor(route: string) {
		
		this.route = route;
	}
	
	public generate(entity: Object, params: Object = {}): string {
		
		// match parameters
		let matches = this.route.split(
			new RegExp(this.regExpEscape('{') +
			'((?:.|[\r\n])+?)(?:' +
			this.regExpEscape('}') + '|$)')
		);
		
		let result = [];
		
		for (let i = 0; i < matches.length; i++) {
			
			if (i % 2 === 1) {
				
				matches[i] = entity[matches[i]];
				
			}
			
			result.push(matches[i]);
			
		}
		
		return this.removeLastSlash(result.join('')) + this.serialize(params);
		
	}
	
	private serialize(queryParams: Object) {
		
		var queryString = [];
		
		for (let param in queryParams) {
			
			if (queryParams.hasOwnProperty(param)) {
				
				queryString.push(encodeURIComponent(param) + '=' + encodeURIComponent(queryParams[param]));
				
			}
			
		} 
		
		return queryString.length > 0 ? '?' + queryString.join('&') : '';
		
	}
	
	private regExpEscape(expresion: string): string {
		
		return String(expresion).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
		
	}
	
	private removeLastSlash(route: string): string {
		
		if (route[route.length - 1] === '/') {
			return route.substring(0, route.length - 1);
		}
		
		return route;
	}
	
}
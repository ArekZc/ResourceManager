import {IApiRegistry} from "../Registry/IApiRegistry";

export class Configuration {
	
	public apiRegistry: IApiRegistry; 
	
	constructor(apiRegisty: IApiRegistry) {
		
		this.apiRegistry = apiRegisty;
	
	}
	
}
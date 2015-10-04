/// <reference path="../Registry/ResourceRegistry.ts" />

module arekzc.resource.configuration {
	
	export class Configuration {
		
		public resourceRegistry: arekzc.resource.registry.IResourceRegistry; 
		
		constructor(resourceRegisty: arekzc.resource.registry.IResourceRegistry) {
			
			this.resourceRegistry = resourceRegisty;
			
		}
		
	}
	
}
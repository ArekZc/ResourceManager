/// <reference path="../../node_modules/definitively-typed/angularjs/angular.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../Resource/IResource.ts" />
/// <reference path="../ResourceManager.ts" />
/// <reference path="IResourceRegistry.ts" />

module arekzc.resource.registry {
	
	export class ResourceRegistry implements IResourceRegistry {
	
		private resources: Object;
		
		constructor() {
			
			this.resources = [];
			
		}
		
		add(resource: arekzc.resource.resource.IResource): IResourceRegistry {
			
			if (resource === undefined) {
				throw new Error('Resource can\'t be undefined');
			}
			
			if (!Reflect.hasOwnMetadata(arekzc.resource.REFLECT_RESOURCE_NAME, resource)) {
				throw new Error('Metadata missing for Resource class');
			}
			
			this.resources[Reflect.getMetadata(arekzc.resource.REFLECT_RESOURCE_NAME, resource)] = resource;
			
			return this;
		}
		
		get(id: string): FunctionConstructor {
			
			return this.resources[id];
			
		}
		
	}
	
}



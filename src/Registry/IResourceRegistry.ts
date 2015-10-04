/// <reference path="../Resource/IResource.ts" />

declare module arekzc.resource.registry {
	
	interface IResourceRegistry {
		add(resource: arekzc.resource.resource.IResource): IResourceRegistry;
		get(id: string): FunctionConstructor;
	}
	
}
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import {IApiRegistry} from "./IApiRegistry";
import {IApi} from "../Api/IApi";
import {REFLECT_RESOURCE_NAME} from "../Manager/ResourceManager";

export class ApiRegistry implements IApiRegistry {
	
	private resources: Object;
	
	constructor() {
		
		this.resources = {};
		
	}
	
	add(resource: IApi): IApiRegistry {
		
		if (resource === undefined) {
			throw new Error('Resource can\'t be undefined');
		}
		
		if (!Reflect.hasMetadata(REFLECT_RESOURCE_NAME, resource)) {
			throw new Error('Metadata missing for Resource class');
		}
		
		this.resources[Reflect.getMetadata(REFLECT_RESOURCE_NAME, resource)] = resource;
		
		return this;
	}
	
	get(id: string): FunctionConstructor {
		
		return this.resources[id];
		
	}
	
}
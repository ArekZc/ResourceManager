/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import {Configuration} from "../Configuration/Configuration";
import {IApi} from "../Api/IApi";
import {Api} from "../Api/Api";
import {IGenerator} from "../Generator/IGenerator";
import {IHandler} from "../Handler/IHandler";
import {ITransform} from "../Transform/ITransform";
import {IFilter} from "../Filter/IFilter";
import {IConverter} from "../Converter/IConverter";
import {ResponseConverter} from "../Converter/ResponseConverter";
import {ResponseErrorConverter} from "../Converter/ResponseErrorConverter";
import {ResponseHandler} from "../Handler/ResponseHandler";
import {RequestTransform} from "../Transform/RequestTransform";

export const REFLECT_RESOURCE_NAME = 'ResourceName';
export const REFLECT_FILTER_NAME = 'Filter';
export const REFLECT_TRANSFORM_NAME = 'TransformRequest';
export const REFLECT_CONVERTER_NAME = 'Converter';
export const REFLECT_ERROR_CONVERTER_NAME = 'ErrorConverter';
export const REFLECT_URL_GENERATOR_NAME = 'Url'; 
export const REFLECT_RESPONSE_HANDLER_NAME = 'Handler';

/**
 * class ResourceManager
 */
export class ResourceManager {
	
	private http: ng.IHttpService;
	
	private configuration: Configuration;
	
	constructor(http: ng.IHttpService, configuration: Configuration) {
		
		this.http = http;
		this.configuration = configuration;
		
	}
	
	create(Resource: any): IApi {
		
		if (!Reflect.hasMetadata(REFLECT_URL_GENERATOR_NAME, Resource)) {
			throw new Error(`"${REFLECT_URL_GENERATOR_NAME}" metadata missing for resource`);
		}
		
		// Read metadata to set resource constructor parameters
		let urlGenerator: IGenerator,
			handler: IHandler,
			transform: ITransform,
			filter: IFilter,
			converter: IConverter,
			errorConverter: IConverter;
		
		urlGenerator = Reflect.getMetadata(REFLECT_URL_GENERATOR_NAME, Resource);
		
		converter = Reflect.hasMetadata(REFLECT_CONVERTER_NAME, Resource) ?
					Reflect.getMetadata(REFLECT_CONVERTER_NAME, Resource) :
					new ResponseConverter(Resource);
					
		errorConverter = Reflect.hasMetadata(REFLECT_ERROR_CONVERTER_NAME, Resource) ?
							Reflect.getMetadata(REFLECT_ERROR_CONVERTER_NAME, Resource) :
							new ResponseErrorConverter();
		
		handler = Reflect.hasMetadata(REFLECT_RESPONSE_HANDLER_NAME, Resource) ?
					Reflect.getMetadata(REFLECT_RESPONSE_HANDLER_NAME, Resource) :
					new ResponseHandler(converter, errorConverter);
					
		transform = Reflect.hasMetadata(REFLECT_TRANSFORM_NAME, Resource) ?
					Reflect.getMetadata(REFLECT_TRANSFORM_NAME, Resource) :
					new RequestTransform();
					
		filter = Reflect.getMetadata(REFLECT_FILTER_NAME, Resource);
		
		let resource: IApi;
		
		if (Reflect.hasOwnMetadata(REFLECT_RESOURCE_NAME, Resource)) {
			
			let resourceName = Reflect.getMetadata(REFLECT_RESOURCE_NAME, Resource);
			
			let ApiClass: any = this.configuration.apiRegistry.get(resourceName);
			
			resource = new ApiClass(
				this,
				this.http,
				urlGenerator,
				handler,
				transform,
				filter	
			);
			
		} else {
			
			resource = new Api(
				this,
				this.http,
				urlGenerator,
				handler,
				transform,
				filter	
			);
			
		}
		
		return resource;
		
	}
}


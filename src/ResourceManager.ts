/// <reference path="../node_modules/definitively-typed/angularjs/angular.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="Resource/ApiResource.ts" />
/// <reference path="Resource/UrlGenerator.ts" />
/// <reference path="Converter/ResponseConverter.ts" />
/// <reference path="Converter/ResponseErrorConverter.ts" />
/// <reference path="Transform/RequestTransform.ts" />
/// <reference path="Handler/ResponseHandler.ts" />
/// <reference path="Registry/ResourceRegistry.ts" />
/// <reference path="Configuration/Configuration.ts" />

module arekzc.resource {
	
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
		
		private configuration: arekzc.resource.configuration.Configuration;
		
		constructor(http: ng.IHttpService, configuration: arekzc.resource.configuration.Configuration) {
			
			this.http = http;
			this.configuration = configuration;
			
		}
		
		getResource(Resource: any): arekzc.resource.resource.IResource {
			
			if (!Reflect.hasMetadata(REFLECT_URL_GENERATOR_NAME, Resource)) {
				throw new Error(`"${REFLECT_URL_GENERATOR_NAME}" metadata missing for resource`);
			}
			
			// Read metadata to set resource constructor parameters
			let urlGenerator: arekzc.resource.resource.UrlGenerator,
				handler: arekzc.resource.handler.IHandler,
				transform: arekzc.resource.transform.ITransform,
				filter: arekzc.resource.filter.IFilter,
				converter: arekzc.resource.converter.IConverter,
				errorConverter: arekzc.resource.converter.IConverter;
			
			urlGenerator = Reflect.getMetadata(REFLECT_URL_GENERATOR_NAME, Resource);
			
			converter = Reflect.hasMetadata(REFLECT_CONVERTER_NAME, Resource) ?
						Reflect.getMetadata(REFLECT_CONVERTER_NAME, Resource) :
						new arekzc.resource.converter.ResponseConverter(Resource);
						
			errorConverter = Reflect.hasMetadata(REFLECT_ERROR_CONVERTER_NAME, Resource) ?
							 Reflect.getMetadata(REFLECT_ERROR_CONVERTER_NAME, Resource) :
							 new arekzc.resource.converter.ResponseErrorConverter();
			
			handler = Reflect.hasMetadata(REFLECT_RESPONSE_HANDLER_NAME, Resource) ?
					  Reflect.getMetadata(REFLECT_RESPONSE_HANDLER_NAME, Resource) :
					  new arekzc.resource.handler.ResponseHandler(converter, errorConverter);
					  
			transform = Reflect.hasMetadata(REFLECT_TRANSFORM_NAME, Resource) ?
						Reflect.getMetadata(REFLECT_TRANSFORM_NAME, Resource) :
						new arekzc.resource.transform.RequestTransform();
						
			filter = Reflect.getMetadata(REFLECT_FILTER_NAME, Resource);
			
			let resource: arekzc.resource.resource.IResource;
			
			if (Reflect.hasOwnMetadata(REFLECT_RESOURCE_NAME, Resource)) {
				
				let resourceName = Reflect.getMetadata(REFLECT_RESOURCE_NAME, Resource);
				
				let ResourceClass = this.configuration.resourceRegistry.get(resourceName);
				
				resource = new ResourceClass(
					this,
					this.http,
					urlGenerator,
					handler,
					transform,
					filter	
				);
				
			} else {
				
				resource = new arekzc.resource.resource.ApiResource(
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
}


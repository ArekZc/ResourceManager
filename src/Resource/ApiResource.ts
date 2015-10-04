/// <reference path="../../node_modules/definitively-typed/angularjs/angular.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../Filter/IFilter.ts" />
/// <reference path="../Handler/IHandler.ts" />
/// <reference path="IResource" />
/// <reference path="../ResourceManager.ts" />
/// <reference path="../Transform/ITransform.ts" />
/// <reference path="UrlGenerator.ts" />

module arekzc.resource.resource {
	
	/**
	* class EntityResource
	*/
	export class ApiResource implements IResource {
		
		public resourceManager: arekzc.resource.ResourceManager;
		
		private http: ng.IHttpService;
		
		public urlGenerator: UrlGenerator;
		
		public filter: arekzc.resource.filter.IFilter;
		
		public handler: arekzc.resource.handler.IHandler;
		
		public transform: arekzc.resource.transform.ITransform;
		
		constructor(
			resourceManager: arekzc.resource.ResourceManager,
			http: ng.IHttpService,
			urlGenerator: UrlGenerator,
			handler: arekzc.resource.handler.IHandler,
			transform: arekzc.resource.transform.ITransform,
			filter: arekzc.resource.filter.IFilter
		) {
			
			this.resourceManager = resourceManager;
			this.http = http;
			this.urlGenerator = urlGenerator;
			this.handler = handler;
			this.transform = transform;
			this.filter = filter;
			
		}
		
		save(resource: Object): ng.IHttpPromise<any> {
		
			// Generate url from parameters
			let url = this.urlGenerator.generate(resource);
			
			// Filter resource fields for request and transform them to final form
			let data: Object;
			
			if (this.filter !== undefined) {
				data = this.filter.filter(resource);
			}
			data = this.transform.transform(data);
			
			// Make API request for resource and set serialization method
			return this.http({
				 method: 'POST',
				 url: url,
				 data: data,
				 transformResponse: this.getTransformResponse()
			});
		
		}
		
		update(resource: any): ng.IHttpPromise<any> {
			
			// Generate url from parameters
			let url = this.urlGenerator.generate(resource);
			
			// Filter resource fields for request and transform them to final form
			let data: Object;
			
			if (this.filter !== undefined) {
				data = this.filter.filter(resource);
			}
			data = this.transform.transform(data);
			
			// Make API request for resource and set serialization method
			return this.http({
				 method: 'PUT',
				 url: url,
				 data: data,
				 transformResponse: this.getTransformResponse()
			});
			
		}
		
		query(routeParams: Object, queryParams: Object, headers = {}): ng.IHttpPromise<any> {
			
			// Generate url from parameters
			let url = this.urlGenerator.generate(routeParams, queryParams);
			
			return this.http({
				 method: 'GET',
				 url: url,
				 transformResponse: this.getTransformResponse()
			});
		}
		
		remove(entity: any): ng.IHttpPromise<any> {
			
			// Generate url from parameters
			let url = this.urlGenerator.generate(entity);
			
			return this.http({
				 method: 'DELETE',
				 url: url
			});
			
		}
		
		get(routeParams: Object): ng.IHttpPromise<any> {
			
			// Generate url from parameters
			let url = this.urlGenerator.generate(routeParams);
			
			return this.http({
				 method: 'GET',
				 url: url,
				 transformResponse: this.getTransformResponse()
			});
			
		}
		
		private getTransformResponse() {
			
			let defaults = this.http.defaults.transformResponse;
			
			// Make sure is array
			defaults = Array.isArray(defaults) ? defaults : [defaults];
			
			// Add conversion to request
			return defaults.concat((resp, headers, status) => {
				
				return this.handler.handle(resp, headers, status);
				
			});
			
		}
	}
}
import {IApi} from "./IApi";
import {ResourceManager} from "../Manager/ResourceManager";
import {IGenerator} from "../Generator/IGenerator";
import {IFilter} from "../Filter/IFilter";
import {IHandler} from "../Handler/IHandler";
import {ITransform} from "../Transform/ITransform";

export class Api implements IApi {
	
	public resourceManager: ResourceManager;
		
	private http: ng.IHttpService;
	
	public urlGenerator: IGenerator;
	
	public filter: IFilter;
	
	public handler: IHandler;
	
	public transform: ITransform;
	
	constructor(
		resourceManager: ResourceManager,
		http: ng.IHttpService,
		urlGenerator: IGenerator,
		handler: IHandler,
		transform: ITransform,
		filter: IFilter
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
	
	update(resource: Object): ng.IHttpPromise<any> {
		
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
		
		let defaults: any = this.http.defaults.transformResponse;
		
		// Make sure is array
		defaults = Array.isArray(defaults) ? defaults : [defaults];
		
		// Add conversion to request
		return defaults.concat((resp, headers, status) => {
			
			return this.handler.handle(resp, headers, status);
			
		});
		
	}
	
}
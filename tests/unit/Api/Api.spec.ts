/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

describe('Unit: Api class', () => {
	
	let global: any = window,
		Api = global.azResource.Api,
		api: any,
		http: any,
		handler: any,
		resourceManager: any,
		urlGenerator: any,
		transform: any,
		filter: any;
	
	it('should be defined', () => {
		
		expect(Api).toBeDefined();
		
	});
	
	it('should be instantied', () => {
		
		let registry = new global.azResource.ApiRegistry(),
			configuration = new global.azResource.Configuration(registry);
			
		let converter = new global.azResource.ResponseConverter(),
			errorConverter = new global.azResource.ResponseErrorConverter();
		
		http = angular.injector(['ng']).get('$http');
		resourceManager = new global.azResource.ResourceManager(http, configuration);
		filter = new global.azResource.Whitelist(['id']);
		transform = new global.azResource.RequestTransform();
		urlGenerator = new global.azResource.UrlGenerator('/api/books/{id}');
		handler = new global.azResource.ResponseHandler(converter, errorConverter);
		
		api = new Api(resourceManager, http, urlGenerator, handler, filter, transform);
		
		expect(api instanceof Api).toBeTruthy();
		
	});
	
	it('should have method "save" which', () => {
		
		it('should be defined', () => {
			
			expect(api.save).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			api.save({});
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'POST',
				url: '/books/1',
				data: {},
				transformResponse: jasmine.any(Function)
			});
			
		});
		
	});
	
	it('should have method "update" which', () => {
		
		it('should be defined', () => {
			
			expect(api.update).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			api.update({});
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'PUT',
				url: '/books/1',
				data: {},
				transformResponse: jasmine.any(Function)
			});
			
		});
		
	});
	
	it('should have method "query" which', () => {
		
		it('should be defined', () => {
			
			expect(api.query).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			api.query({}, {});
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'GET',
				url: '/books/1',
				data: {},
				transformResponse: jasmine.any(Function)
			});
			
		});
		
	});
	
	it('should have method "remove" which', () => {
		
		it('should be defined', () => {
			
			expect(api.remove).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			api.remove({});
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'DELETE',
				url: '/books/1'
			});
			
		});
		
	});
	
	it('should have method "get" which', () => {
		
		it('should be defined', () => {
			
			expect(api.get).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			api.get(1);
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'GET',
				url: '/books/1',
				transformResponse: jasmine.any(Function)
			});
			
		});
		
	});
	
});
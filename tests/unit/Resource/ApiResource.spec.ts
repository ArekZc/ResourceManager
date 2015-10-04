/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Resource/ApiResource.ts" />

describe('Unit: ApiResource class', () => {
	
	let apiResource: arekzc.resource.resource.ApiResource, http, urlGenerator, handler, transform, filter;
	
	beforeEach(() => {
		
		http = jasmine.createSpy('http');
		urlGenerator = {
			generate: jasmine.createSpy('generate').and.returnValue('/books/1')
		};
		
		handler = {
			handle: jasmine.createSpy('handle')
		};
		
		transform = {
			transform: jasmine.createSpy('transform').and.returnValue({})
		};
		
		filter = {
			filter: jasmine.createSpy('fiter').and.returnValue({})
		}
		
		apiResource = new arekzc.resource.resource.ApiResource(
			undefined,
			http,
			urlGenerator,
			handler,
			transform,
			filter	
		);
		
	});
	
	it('should be defined', () => {
		
		expect(arekzc.resource.resource.ApiResource).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		expect(apiResource instanceof arekzc.resource.resource.ApiResource).toBeTruthy();
		
	});
	
	it('should have method "save" which', () => {
		
		it('should be defined', () => {
			
			expect(apiResource.save).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			apiResource.save({});
			
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
			
			expect(apiResource.update).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			apiResource.update({});
			
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
			
			expect(apiResource.query).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			apiResource.query({}, {});
			
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
			
			expect(apiResource.remove).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			apiResource.remove({});
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'DELETE',
				url: '/books/1'
			});
			
		});
		
	});
	
	it('should have method "get" which', () => {
		
		it('should be defined', () => {
			
			expect(apiResource.get).toBeDefined();
			
		});
		
		it('should call http service general method with good configuration', () => {
			
			apiResource.get(1);
			
			expect(http).toHaveBeenCalledWith({				 
				method: 'GET',
				url: '/books/1',
				transformResponse: jasmine.any(Function)
			});
			
		});
		
	});
	
});
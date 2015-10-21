/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

describe('Integration: ResourceManager class', () => {
	
	let global: any = window,
		UrlGenerator = global.azResource.UrlGenerator;
	
	Reflect.defineMetadata('Url', new UrlGenerator('/book-types/{id}'), BookType);
	
	function BookType() {
		
		this.id = undefined;
		
		this.name = undefined;
		
	}
	
	Reflect.defineMetadata('Url', new UrlGenerator('/book-keywords/{id}'), BookKeyword);
	
	function BookKeyword() {
		
		this.id = undefined;
		this.name = undefined;
		
	}
	
	Reflect.defineMetadata('Url', new UrlGenerator('/books/{id}'), Book);
	
	function Book() {
		
		this.id = undefined;
		
		this.title = undefined;
		
		this.type = undefined;
		
		this.keywords = [];
		
		this.addKeyword = function (keyword) {
			
			this.keywords.push(keyword);
			
			return this;
		}
		
		this.removeKeyword = function (keyword) {
			
			let index = this.keywords.indexOf(keyword);
			
			if (index > -1) {
				this.keywords.splice(index, 1);
			}
	
			return this;
			
		}
		
	}
	
	let resourceManager, http, registry, configuration;
	
	beforeEach(() => {
		
		http = angular.injector(['ng']).get('$http');

		registry = new global.azResource.ApiRegistry();
		
		configuration = new global.azResource.Configuration(registry);
		
		resourceManager = new global.azResource.ResourceManager(http, configuration);
		
	});
	
	it('should create resource class based on annotations', () => {

		expect(resourceManager.getResource(Book) instanceof global.azResource.Api).toBeTruthy();
		
	});
	
});
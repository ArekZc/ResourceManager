/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../node_modules/definitively-typed/angularjs/angular.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../src/Resource/UrlGenerator.ts" />
/// <reference path="../../src/ResourceManager.ts" />
/// <reference path="../../src/Resource/ApiResource.ts" />
/// <reference path="../../src/Configuration/Configuration.ts" />
/// <reference path="../../src/Registry/ResourceRegistry.ts" />

let UrlGenerator = arekzc.resource.resource.UrlGenerator;

module tests.resource {
	
	@Reflect.metadata('Url', new UrlGenerator('/book-types/{id}'))
	export class BookType {
		
		public id: number;
		
		public name: string;
		
	}
	
	@Reflect.metadata('Url', new UrlGenerator('/book-keywords/{id}'))
	export class BookKeyword {
		
		public id: number;
		
		public name: string;
	}
	
	
	@Reflect.metadata('Url', new UrlGenerator('/books/{id}'))
	export class Book {
		
		public id: number;
		
		public title: string;
		
		public type: BookType;
		
		public keywords: Array<BookKeyword>;
		
		constructor() {
			
			this.keywords = [];
			
		}
		
		addKeyword(keyword: BookKeyword): Book {
			
			this.keywords.push(keyword);
			
			return this;
		}
		
		removeKeyword(keyword: BookKeyword): Book {
			
			let index = this.keywords.indexOf(keyword);
			
			if (index > -1) {
				this.keywords.splice(index, 1);
			}
	
			return this;
			
		}
		
	}
	
}

describe('Integration: ResourceManager class', () => {
	
	let resourceManager, http, registry, configuration;
	
	beforeEach(() => {
		
		http = angular.injector(['ng']).get('$http');

		registry = new arekzc.resource.registry.ResourceRegistry();
		
		configuration = new arekzc.resource.configuration.Configuration(registry);
		
		resourceManager = new arekzc.resource.ResourceManager(http, configuration);
		
	});
	
	it('should create resource class based on annotations', () => {

		expect(resourceManager.getResource(tests.resource.Book) instanceof arekzc.resource.resource.ApiResource).toBeTruthy();
		
	});
	
});
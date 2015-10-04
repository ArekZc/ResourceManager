/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Resource/UrlGenerator.ts" />

describe('Unit: UrlGenerator class', () => {
	
	let urlGenerator: arekzc.resource.resource.UrlGenerator;
	
	beforeEach(() => {
		
		urlGenerator = new arekzc.resource.resource.UrlGenerator('/books/{id}')
		
	});
	
	it('should be defined', () => {
		
		expect(arekzc.resource.resource.UrlGenerator).toBeDefined();
		
	});
	
	it('should be instantiated', () => {
		
		expect(urlGenerator instanceof arekzc.resource.resource.UrlGenerator).toBeTruthy();
		
	});
	
	describe('method "generate"', () => {
		
		it('should be defined', () => {
			
			expect(urlGenerator.generate).toBeDefined();
			
		});
		
		it('should return route without parameters when none pass', () => {
			
			expect(urlGenerator.generate({})).toBe('/books');
			
		});
		
		it('should return route with parameters when pass', () => {
			
			expect(urlGenerator.generate({id: 1})).toBe('/books/1');
			
		});
		
		it('should return route with query params when second argument pass', () => {
			
			expect(urlGenerator.generate({id: 1}, {query1: 'query', query2: 'query'})).toBe('/books/1?query1=query&query2=query');
			
		});
		
	});
	
});
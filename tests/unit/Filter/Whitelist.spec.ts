/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Filter/Whitelist.ts" />

describe('Unit: Whitelist class', () => {
	
	let whitelist: arekzc.resource.filter.Whitelist;
	
	it('should be defined', () => {
		
		expect(arekzc.resource.filter.Whitelist).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		whitelist = new arekzc.resource.filter.Whitelist(['id']);
		
		expect(whitelist instanceof arekzc.resource.filter.Whitelist).toBeTruthy();
		
	});
	
	it('should have method "filter" which', () => {
		
		it('should be defined', () => {
			
			expect(whitelist.filter).toBeDefined();
			
		});
		
		it('should return object with fields passed in constructor', () => {
			
			expect(whitelist.filter({id: 1, title: 'title'})).toBe({id: 1});
			
			
		});
		
	});
	
});
/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Filter/Blacklist.ts" />

describe('Unit: Whitelist class', () => {
	
	let whitelist: arekzc.resource.filter.Blacklist;
	
	it('should be defined', () => {
		
		expect(arekzc.resource.filter.Blacklist).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		whitelist = new arekzc.resource.filter.Blacklist(['id']);
		
		expect(whitelist instanceof arekzc.resource.filter.Blacklist).toBeTruthy();
		
	});
	
	it('should have method "filter" which', () => {
		
		it('should be defined', () => {
			
			expect(whitelist.filter).toBeDefined();
			
		});
		
		it('should return object without fields passed in constructor', () => {
			
			expect(whitelist.filter({id: 1, title: 'title'})).toBe({title: 'title'});
			
			
		});
		
	});
	
});
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: Blacklist class', () => {
	
	let global: any = window,
		Blacklist = global.azResource.Blacklist,
		blacklist: any;
	
	it('should be defined', () => {
		
		expect(Blacklist).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		blacklist = new Blacklist(['id']);
		
		expect(blacklist instanceof Blacklist).toBeTruthy();
		
	});
	
	it('should have method "filter" which', () => {
		
		it('should be defined', () => {
			
			expect(blacklist.filter).toBeDefined();
			
		});
		
		it('should return object without fields passed in constructor', () => {
			
			expect(blacklist.filter({id: 1, title: 'title'})).toBe({title: 'title'});
			
			
		});
		
	});
	
});
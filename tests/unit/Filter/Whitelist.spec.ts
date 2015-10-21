/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: Whitelist class', () => {
	
	let global: any = window,
		Whitelist = global.azResource.Whitelist,
		whitelist: any;
	
	it('should be defined', () => {
		
		expect(Whitelist).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		whitelist = new Whitelist(['id']);
		
		expect(whitelist instanceof Whitelist).toBeTruthy();
		
	});
	
	describe('should have method "filter" which', () => {
		
		it('should be defined', () => {
			
			expect(whitelist.filter).toBeDefined();
			
		});
		
		it('should return object with fields passed in constructor', () => {
			
			expect(whitelist.filter({id: 1, title: 'title'})).toEqual({id: 1});
			
			
		});
		
	});
	
});
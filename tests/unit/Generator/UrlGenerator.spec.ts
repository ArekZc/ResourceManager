/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: UrlGenerator class', () => {
	
	let global: any = window,
		UrlGenerator = global.azResource.UrlGenerator,
		generator: any;
	
	it('should be defined', () => {
		
		expect(global.azResource.UrlGenerator).toBeDefined();
		
	});
	
});
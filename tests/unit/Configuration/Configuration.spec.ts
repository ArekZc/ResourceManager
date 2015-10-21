/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: Configuration class', () => {
	
	let global: any = window,
		Configuration = global.azResource.Configuration,
		ApiRegistry = global.azResource.ApiRegistry,
		configuration: any,
		registry: any;
	
	it('should be defined', () => {
		
		expect(Configuration).toBeDefined();
		
	});
	
	it('should be instantied', () => {
		
		registry = new ApiRegistry();
		
		configuration = new Configuration(registry);
		
		expect(configuration instanceof Configuration).toBeTruthy();
		
	});
	
});
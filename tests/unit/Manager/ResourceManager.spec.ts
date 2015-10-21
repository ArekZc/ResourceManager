/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: ResourceManager class', () => {
	
	let global: any = window,
		ResourceManager = global.azResource.ResourceManager,
		resourceManager: any,
		http: any,
		configuration: any;
	
	it('should be defined', () => {
		
		expect(ResourceManager).toBeDefined();
		
	});
	
	it('should be instantied', () => {
		
		let registry = new global.azResource.ApiRegistry();
		
		configuration = new global.azResource.Configuration(registry);
		http = angular.injector(['ng']).get('$http');
		
		resourceManager = new ResourceManager(http, configuration);
		
		expect(resourceManager instanceof ResourceManager).toBeTruthy();
		
	});
	
	describe('should have method "create" which', () => {
		
		it('should be defined', () => {
			
			expect(resourceManager.create).toBeDefined();
			
		});
		
	});
	
});
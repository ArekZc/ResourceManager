/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: RequestTransform class', () => {
	
	let global: any = window,
		RequestTransform = global.azResource.RequestTransform,
		transform: any;
	
	it('should be defined', () => {
		
		expect(RequestTransform).toBeDefined();
		
	});
	
	it('should be instantied', () => {
		
		transform = new RequestTransform();
		
		expect(transform instanceof RequestTransform).toBeTruthy();
		
	});
	
});
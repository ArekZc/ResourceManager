/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: ResponseErrorConverter class', () => {
	
	let global: any = window,
		ResponseErrorConverter = global.azResource.ResponseErrorConverter,
		converter: any;
		
	function Book () {
		
		this.id = undefined;
		this.title = undefined;
		
	}
	
	it('should be defined', () => {
		
		expect(ResponseErrorConverter).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		converter = new ResponseErrorConverter(Book);
		
		expect(converter instanceof ResponseErrorConverter).toBeTruthy();
		
	});
	
});
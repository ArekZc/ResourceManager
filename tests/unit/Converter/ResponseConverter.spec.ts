/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: ResponseConverter class', () => {
	
	let global: any = window,
		ResponseConverter = global.azResource.ResponseConverter,
		converter: any;
		
	function Book () {
		
		this.id = undefined;
		this.title = undefined;
		
	}
	
	it('should be defined', () => {
		
		expect(ResponseConverter).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		converter = new ResponseConverter(Book);
		
		expect(converter instanceof ResponseConverter).toBeTruthy();
		
	});
	
	it('should convert simply object to model instance', () => {
		
		expect(converter.convert({id: 1, title: 'title'}) instanceof Book).toBeTruthy();
		
	});
	
});
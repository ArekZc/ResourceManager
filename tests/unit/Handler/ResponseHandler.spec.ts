/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('Unit: ResponseHandler class', () => {
	
	let global: any = window,
		ResponseHandler = global.azResource.ResponseHandler,
		ResponseConverter = global.azResource.ResponseConverter,
		ResponseErrorConverter = global.azResource.ResponseErrorConverter,
		handler: any,
		converter: any,
		errorConverter: any;
		
	function Book() {
		this.id = undefined;
		this.title = undefined;
	}
	
	it('should be defined', () => {
		
		expect(ResponseHandler).toBeDefined();
		
	});

	it('should be instanted', () => {
		
		converter = new ResponseConverter(Book);
		errorConverter = new ResponseErrorConverter();
		
		handler = new ResponseHandler(converter, errorConverter);
		
	});
	
	describe('should have method "handle" which', () => {
		
		it('should be defined', () => {
			
			expect(handler.handle).toBeDefined();
			
		});
		
		it('should run response converter when response status is not error', () => {
			
			spyOn(converter, 'convert');
			
			handler.handle({data: {}}, {}, 200);
			
			expect(converter.convert).toHaveBeenCalled();
			
		});
		
		it('should run response converter when response is collection', () => {
			
			spyOn(converter, 'convert');
			
			handler.handle({data: [{id: 1}]}, {}, 200);
			
			expect(converter.convert).toHaveBeenCalled();
			
		});
		
		it('should run error response converter when response status is error', () => {
			
			spyOn(errorConverter, 'convert');
			
			handler.handle({data: [{id: 1}]}, {}, 404);
			
			expect(errorConverter.convert).toHaveBeenCalled();
			
		});
		
	});
	
});
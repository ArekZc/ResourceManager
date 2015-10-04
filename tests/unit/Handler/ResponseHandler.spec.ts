/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Handler/ResponseHandler.ts" />

describe('Unit: ResponseHandler class', () => {
	
	let handler: arekzc.resource.handler.IHandler, converter, errorConverter;
	
	beforeEach(() => {
		
		converter = {
			convert: jasmine.createSpy('convert')	
		};
		
		errorConverter = {
			convert: jasmine.createSpy('errorConvert')	
		};
		
		handler = new arekzc.resource.handler.ResponseHandler(converter, errorConverter);
		
	});
	
	it('should be defined', () => {
		
		expect(arekzc.resource.handler.ResponseHandler).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		expect(handler instanceof arekzc.resource.handler.ResponseHandler).toBeTruthy();
		
	});
	
	it('should have method "handle" which', () => {
		
		it('should be defined', () => {
			
			expect(handler.handle).toBeDefined();
			
		});
		
		it('should run response converter when response status is not error', () => {
			
			handler.handle({data: {}}, {}, 200);
			
			expect(converter.convert).toHaveBeenCalled();
			
		});
		
		it('should run response converter when response is collection', () => {
			
			handler.handle({data: [{id: 1}]}, {}, 200);
			
			expect(converter.convert).toHaveBeenCalled();
			
		});
		
		it('should run error response converter when response status is error', () => {
			
			handler.handle({data: [{id: 1}]}, {}, 404);
			
			expect(errorConverter.convert).toHaveBeenCalled();
			
		});
		
	});
	
});
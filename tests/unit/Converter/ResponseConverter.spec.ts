/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../src/Converter/ResponseConverter.ts" />

module tests.converter {
	
	export class Book {
		
		public id: number;
		
		public title: string;
		
		constructor() {
			
		}
		
	}
	
}

describe('Unit: ResponseConverter class', () => {
	
	let converter: arekzc.resource.converter.ResponseConverter;
	
	it('should be defined', () => {
		
		expect(arekzc.resource.converter.ResponseConverter).toBeDefined();
		
	});
	
	it('should be instanted', () => {
		
		converter = new arekzc.resource.converter.ResponseConverter(tests.converter.Book);
		
		expect(converter instanceof arekzc.resource.converter.ResponseConverter).toBeTruthy();
		
	});
	
	it('should convert simply object to model instance', () => {
		
		expect(converter.convert({id: 1, title: 'title'}) instanceof tests.converter.Book).toBeTruthy();
		
	});
	
});
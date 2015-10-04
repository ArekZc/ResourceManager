/// <reference path="../../node_modules/definitively-typed/angularjs/angular.d.ts" />
/// <reference path="../Converter/IConverter.ts" />
/// <reference path="IHandler.ts" />

module arekzc.resource.handler {
	
	export class ResponseHandler implements IHandler {
		
		private converter: arekzc.resource.converter.IConverter;
		
		private errorConverter: arekzc.resource.converter.IConverter;
		
		constructor(converter: arekzc.resource.converter.IConverter, errorConverter: arekzc.resource.converter.IConverter) {
			
			this.converter = converter;
			this.errorConverter = errorConverter;
			
		}
		
		handle(response: any, header: Object, status: number): any {
			
			let isErrorResponse = status > 400;
			
			if (!isErrorResponse) {
				
				if (Array.isArray(response.data)) {
					
					for (let i = 0; i < response.data.length; i++) {
						
						response.data[i] = this.converter.convert(response.data[i]);
						
					}
					
					return response;
					
				} else {
					
					return this.converter.convert(response.data);
					
				}
				
			} else {
				
				return this.errorConverter.convert(response.data);
				
			}
			
		}
		
	}
	
}
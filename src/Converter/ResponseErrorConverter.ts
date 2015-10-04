/// <reference path="IConverter.ts" />

module arekzc.resource.converter {
	
	export class ResponseErrorConverter implements IConverter {
		
		convert(object: Object): Object {
			
			// For now only pass the data from API
			// TODO: Prepare default converstion for errors
			return object;
			
		}
		
	}
	
}
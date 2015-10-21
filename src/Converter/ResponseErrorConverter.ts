import {IConverter} from "./IConverter";

export class ResponseErrorConverter implements IConverter {
	
	convert(object: Object): Object {
		
		// For now only pass the data from API
		// TODO: Prepare default converstion for errors
		return object;
		
	}
	
}
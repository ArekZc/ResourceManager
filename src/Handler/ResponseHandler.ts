import {IConverter} from "../Converter/IConverter";
import {IHandler} from "./IHandler";

export class ResponseHandler implements IHandler {
		
	private converter: IConverter;
	
	private errorConverter: IConverter;
	
	constructor(converter: IConverter, errorConverter: IConverter) {
		
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
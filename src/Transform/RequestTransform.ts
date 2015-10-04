/// <reference path="ITransform.ts" />

module arekzc.resource.transform {
	
	export class RequestTransform implements ITransform {
		
		transform(object: any): Object {
			
			return object;
			
		}
		
	}
	
}

declare module arekzc.resource.handler {
	
	interface IHandler {
		handle(response: any, headers: Object, status: number): any;
	}
	
}
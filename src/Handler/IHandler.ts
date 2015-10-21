
export interface IHandler {
	handle(response: any, headers: Object, status: number): any;
}
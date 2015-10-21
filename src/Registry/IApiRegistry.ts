import {IApi} from "../Api/IApi";

export interface IApiRegistry {
	add(resource: IApi): IApiRegistry;
	get(id: string): FunctionConstructor;
}
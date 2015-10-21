export interface IGenerator {
	generate(resource: Object, queryParams?: Object): string;
}
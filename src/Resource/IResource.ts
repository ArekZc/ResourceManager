/// <reference path="../../node_modules/definitively-typed/angularjs/angular.d.ts" />

declare module arekzc.resource.resource {
	
	interface IResource {
		save(resource: Object): ng.IHttpPromise<any>;
		update(resource: Object): ng.IHttpPromise<any>;
		remove(resource: Object): ng.IHttpPromise<any>;
		query(routeParams: Object, queryParams: Object): ng.IHttpPromise<any>;
		get(id: number): ng.IHttpPromise<any>;
	}
	
}
/// <reference path="../../typings/angularjs/angular.d.ts" />

export interface IApi {
	save(resource: Object): ng.IHttpPromise<any>;
	update(resource: Object): ng.IHttpPromise<any>;
	remove(resource: Object): ng.IHttpPromise<any>;
	query(routeParams: Object, queryParams: Object): ng.IHttpPromise<any>;
	get(id: number): ng.IHttpPromise<any>;
}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ResourceManager_1 = require("./src/Manager/ResourceManager");
var Whitelist_1 = require("./src/Filter/Whitelist");
var Blacklist_1 = require("./src/Filter/Blacklist");
var UrlGenerator_1 = require("./src/Generator/UrlGenerator");
var ResponseConverter_1 = require("./src/Converter/ResponseConverter");
var ResponseErrorConverter_1 = require("./src/Converter/ResponseErrorConverter");
var Configuration_1 = require("./src/Configuration/Configuration");
var Api_1 = require("./src/Api/Api");
var ResponseHandler_1 = require("./src/Handler/ResponseHandler");
var ApiRegistry_1 = require("./src/Registry/ApiRegistry");
var RequestTransform_1 = require("./src/Transform/RequestTransform");
var global = window;
global.azResource = {
    ResourceManager: ResourceManager_1.ResourceManager,
    Whitelist: Whitelist_1.Whitelist,
    Blacklist: Blacklist_1.Blacklist,
    UrlGenerator: UrlGenerator_1.UrlGenerator,
    ResponseConverter: ResponseConverter_1.ResponseConverter,
    ResponseErrorConverter: ResponseErrorConverter_1.ResponseErrorConverter,
    Configuration: Configuration_1.Configuration,
    Api: Api_1.Api,
    ResponseHandler: ResponseHandler_1.ResponseHandler,
    ApiRegistry: ApiRegistry_1.ApiRegistry,
    RequestTransform: RequestTransform_1.RequestTransform
};
},{"./src/Api/Api":2,"./src/Configuration/Configuration":3,"./src/Converter/ResponseConverter":4,"./src/Converter/ResponseErrorConverter":5,"./src/Filter/Blacklist":6,"./src/Filter/Whitelist":7,"./src/Generator/UrlGenerator":8,"./src/Handler/ResponseHandler":9,"./src/Manager/ResourceManager":10,"./src/Registry/ApiRegistry":11,"./src/Transform/RequestTransform":12}],2:[function(require,module,exports){
var Api = (function () {
    function Api(resourceManager, http, urlGenerator, handler, transform, filter) {
        this.resourceManager = resourceManager;
        this.http = http;
        this.urlGenerator = urlGenerator;
        this.handler = handler;
        this.transform = transform;
        this.filter = filter;
    }
    Api.prototype.save = function (resource) {
        var url = this.urlGenerator.generate(resource);
        var data;
        if (this.filter !== undefined) {
            data = this.filter.filter(resource);
        }
        data = this.transform.transform(data);
        return this.http({
            method: 'POST',
            url: url,
            data: data,
            transformResponse: this.getTransformResponse()
        });
    };
    Api.prototype.update = function (resource) {
        var url = this.urlGenerator.generate(resource);
        var data;
        if (this.filter !== undefined) {
            data = this.filter.filter(resource);
        }
        data = this.transform.transform(data);
        return this.http({
            method: 'PUT',
            url: url,
            data: data,
            transformResponse: this.getTransformResponse()
        });
    };
    Api.prototype.query = function (routeParams, queryParams, headers) {
        if (headers === void 0) { headers = {}; }
        var url = this.urlGenerator.generate(routeParams, queryParams);
        return this.http({
            method: 'GET',
            url: url,
            transformResponse: this.getTransformResponse()
        });
    };
    Api.prototype.remove = function (entity) {
        var url = this.urlGenerator.generate(entity);
        return this.http({
            method: 'DELETE',
            url: url
        });
    };
    Api.prototype.get = function (routeParams) {
        var url = this.urlGenerator.generate(routeParams);
        return this.http({
            method: 'GET',
            url: url,
            transformResponse: this.getTransformResponse()
        });
    };
    Api.prototype.getTransformResponse = function () {
        var _this = this;
        var defaults = this.http.defaults.transformResponse;
        defaults = Array.isArray(defaults) ? defaults : [defaults];
        return defaults.concat(function (resp, headers, status) {
            return _this.handler.handle(resp, headers, status);
        });
    };
    return Api;
})();
exports.Api = Api;
},{}],3:[function(require,module,exports){
var Configuration = (function () {
    function Configuration(apiRegisty) {
        this.apiRegistry = apiRegisty;
    }
    return Configuration;
})();
exports.Configuration = Configuration;
},{}],4:[function(require,module,exports){
var ResponseConverter = (function () {
    function ResponseConverter(Entity) {
        this.Entity = Entity;
    }
    ResponseConverter.prototype.convert = function (object) {
        var entity = new this.Entity();
        for (var property in entity) {
            entity[property] = entity[property];
        }
        return entity;
    };
    return ResponseConverter;
})();
exports.ResponseConverter = ResponseConverter;
},{}],5:[function(require,module,exports){
var ResponseErrorConverter = (function () {
    function ResponseErrorConverter() {
    }
    ResponseErrorConverter.prototype.convert = function (object) {
        return object;
    };
    return ResponseErrorConverter;
})();
exports.ResponseErrorConverter = ResponseErrorConverter;
},{}],6:[function(require,module,exports){
var Blacklist = (function () {
    function Blacklist(fields) {
        this.fields = fields;
    }
    Blacklist.prototype.filter = function (object) {
        var result = {};
        for (var prop in object) {
            if (object.hasOwnProperty(prop) && this.fields.indexOf(prop) === -1) {
                result[this.fields[prop]] = object[this.fields[prop]];
            }
        }
        return result;
    };
    return Blacklist;
})();
exports.Blacklist = Blacklist;
},{}],7:[function(require,module,exports){
var Whitelist = (function () {
    function Whitelist(fields) {
        this.fields = fields;
    }
    Whitelist.prototype.filter = function (object) {
        var result = {};
        for (var i = 0; i < this.fields.length; i++) {
            result[this.fields[i]] = object[this.fields[i]];
        }
        return result;
    };
    return Whitelist;
})();
exports.Whitelist = Whitelist;
},{}],8:[function(require,module,exports){
var UrlGenerator = (function () {
    function UrlGenerator(route) {
        this.route = route;
    }
    UrlGenerator.prototype.generate = function (entity, params) {
        if (params === void 0) { params = {}; }
        var matches = this.route.split(new RegExp(this.regExpEscape('{') +
            '((?:.|[\r\n])+?)(?:' +
            this.regExpEscape('}') + '|$)'));
        var result = [];
        for (var i = 0; i < matches.length; i++) {
            if (i % 2 === 1) {
                matches[i] = entity[matches[i]];
            }
            result.push(matches[i]);
        }
        return this.removeLastSlash(result.join('')) + this.serialize(params);
    };
    UrlGenerator.prototype.serialize = function (queryParams) {
        var queryString = [];
        for (var param in queryParams) {
            if (queryParams.hasOwnProperty(param)) {
                queryString.push(encodeURIComponent(param) + '=' + encodeURIComponent(queryParams[param]));
            }
        }
        return queryString.length > 0 ? '?' + queryString.join('&') : '';
    };
    UrlGenerator.prototype.regExpEscape = function (expresion) {
        return String(expresion).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    };
    UrlGenerator.prototype.removeLastSlash = function (route) {
        if (route[route.length - 1] === '/') {
            return route.substring(0, route.length - 1);
        }
        return route;
    };
    return UrlGenerator;
})();
exports.UrlGenerator = UrlGenerator;
},{}],9:[function(require,module,exports){
var ResponseHandler = (function () {
    function ResponseHandler(converter, errorConverter) {
        this.converter = converter;
        this.errorConverter = errorConverter;
    }
    ResponseHandler.prototype.handle = function (response, header, status) {
        var isErrorResponse = status > 400;
        if (!isErrorResponse) {
            if (Array.isArray(response.data)) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i] = this.converter.convert(response.data[i]);
                }
                return response;
            }
            else {
                return this.converter.convert(response.data);
            }
        }
        else {
            return this.errorConverter.convert(response.data);
        }
    };
    return ResponseHandler;
})();
exports.ResponseHandler = ResponseHandler;
},{}],10:[function(require,module,exports){
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
var Api_1 = require("../Api/Api");
var ResponseConverter_1 = require("../Converter/ResponseConverter");
var ResponseErrorConverter_1 = require("../Converter/ResponseErrorConverter");
var ResponseHandler_1 = require("../Handler/ResponseHandler");
var RequestTransform_1 = require("../Transform/RequestTransform");
exports.REFLECT_RESOURCE_NAME = 'ResourceName';
exports.REFLECT_FILTER_NAME = 'Filter';
exports.REFLECT_TRANSFORM_NAME = 'TransformRequest';
exports.REFLECT_CONVERTER_NAME = 'Converter';
exports.REFLECT_ERROR_CONVERTER_NAME = 'ErrorConverter';
exports.REFLECT_URL_GENERATOR_NAME = 'Url';
exports.REFLECT_RESPONSE_HANDLER_NAME = 'Handler';
var ResourceManager = (function () {
    function ResourceManager(http, configuration) {
        this.http = http;
        this.configuration = configuration;
    }
    ResourceManager.prototype.create = function (Resource) {
        if (!Reflect.hasMetadata(exports.REFLECT_URL_GENERATOR_NAME, Resource)) {
            throw new Error("\"" + exports.REFLECT_URL_GENERATOR_NAME + "\" metadata missing for resource");
        }
        var urlGenerator, handler, transform, filter, converter, errorConverter;
        urlGenerator = Reflect.getMetadata(exports.REFLECT_URL_GENERATOR_NAME, Resource);
        converter = Reflect.hasMetadata(exports.REFLECT_CONVERTER_NAME, Resource) ?
            Reflect.getMetadata(exports.REFLECT_CONVERTER_NAME, Resource) :
            new ResponseConverter_1.ResponseConverter(Resource);
        errorConverter = Reflect.hasMetadata(exports.REFLECT_ERROR_CONVERTER_NAME, Resource) ?
            Reflect.getMetadata(exports.REFLECT_ERROR_CONVERTER_NAME, Resource) :
            new ResponseErrorConverter_1.ResponseErrorConverter();
        handler = Reflect.hasMetadata(exports.REFLECT_RESPONSE_HANDLER_NAME, Resource) ?
            Reflect.getMetadata(exports.REFLECT_RESPONSE_HANDLER_NAME, Resource) :
            new ResponseHandler_1.ResponseHandler(converter, errorConverter);
        transform = Reflect.hasMetadata(exports.REFLECT_TRANSFORM_NAME, Resource) ?
            Reflect.getMetadata(exports.REFLECT_TRANSFORM_NAME, Resource) :
            new RequestTransform_1.RequestTransform();
        filter = Reflect.getMetadata(exports.REFLECT_FILTER_NAME, Resource);
        var resource;
        if (Reflect.hasOwnMetadata(exports.REFLECT_RESOURCE_NAME, Resource)) {
            var resourceName = Reflect.getMetadata(exports.REFLECT_RESOURCE_NAME, Resource);
            var ApiClass = this.configuration.apiRegistry.get(resourceName);
            resource = new ApiClass(this, this.http, urlGenerator, handler, transform, filter);
        }
        else {
            resource = new Api_1.Api(this, this.http, urlGenerator, handler, transform, filter);
        }
        return resource;
    };
    return ResourceManager;
})();
exports.ResourceManager = ResourceManager;
},{"../Api/Api":2,"../Converter/ResponseConverter":4,"../Converter/ResponseErrorConverter":5,"../Handler/ResponseHandler":9,"../Transform/RequestTransform":12}],11:[function(require,module,exports){
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
var ResourceManager_1 = require("../Manager/ResourceManager");
var ApiRegistry = (function () {
    function ApiRegistry() {
        this.resources = {};
    }
    ApiRegistry.prototype.add = function (resource) {
        if (resource === undefined) {
            throw new Error('Resource can\'t be undefined');
        }
        if (!Reflect.hasMetadata(ResourceManager_1.REFLECT_RESOURCE_NAME, resource)) {
            throw new Error('Metadata missing for Resource class');
        }
        this.resources[Reflect.getMetadata(ResourceManager_1.REFLECT_RESOURCE_NAME, resource)] = resource;
        return this;
    };
    ApiRegistry.prototype.get = function (id) {
        return this.resources[id];
    };
    return ApiRegistry;
})();
exports.ApiRegistry = ApiRegistry;
},{"../Manager/ResourceManager":10}],12:[function(require,module,exports){
var RequestTransform = (function () {
    function RequestTransform() {
    }
    RequestTransform.prototype.transform = function (object) {
        return object;
    };
    return RequestTransform;
})();
exports.RequestTransform = RequestTransform;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC50cyIsInNyYy9BcGkvQXBpLnRzIiwic3JjL0NvbmZpZ3VyYXRpb24vQ29uZmlndXJhdGlvbi50cyIsInNyYy9Db252ZXJ0ZXIvUmVzcG9uc2VDb252ZXJ0ZXIudHMiLCJzcmMvQ29udmVydGVyL1Jlc3BvbnNlRXJyb3JDb252ZXJ0ZXIudHMiLCJzcmMvRmlsdGVyL0JsYWNrbGlzdC50cyIsInNyYy9GaWx0ZXIvV2hpdGVsaXN0LnRzIiwic3JjL0dlbmVyYXRvci9VcmxHZW5lcmF0b3IudHMiLCJzcmMvSGFuZGxlci9SZXNwb25zZUhhbmRsZXIudHMiLCJzcmMvTWFuYWdlci9SZXNvdXJjZU1hbmFnZXIudHMiLCJzcmMvUmVnaXN0cnkvQXBpUmVnaXN0cnkudHMiLCJzcmMvVHJhbnNmb3JtL1JlcXVlc3RUcmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxnQ0FBOEIsK0JBQStCLENBQUMsQ0FBQTtBQUM5RCwwQkFBd0Isd0JBQXdCLENBQUMsQ0FBQTtBQUNqRCwwQkFBd0Isd0JBQXdCLENBQUMsQ0FBQTtBQUNqRCw2QkFBMkIsOEJBQThCLENBQUMsQ0FBQTtBQUMxRCxrQ0FBZ0MsbUNBQW1DLENBQUMsQ0FBQTtBQUNwRSx1Q0FBcUMsd0NBQXdDLENBQUMsQ0FBQTtBQUM5RSw4QkFBNEIsbUNBQW1DLENBQUMsQ0FBQTtBQUNoRSxvQkFBa0IsZUFBZSxDQUFDLENBQUE7QUFDbEMsZ0NBQThCLCtCQUErQixDQUFDLENBQUE7QUFDOUQsNEJBQTBCLDRCQUE0QixDQUFDLENBQUE7QUFDdkQsaUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFFbEUsSUFBSSxNQUFNLEdBQVEsTUFBTSxDQUFDO0FBRXpCLE1BQU0sQ0FBQyxVQUFVLEdBQUc7SUFDbkIsaUJBQUEsaUNBQWU7SUFDZixXQUFBLHFCQUFTO0lBQ1QsV0FBQSxxQkFBUztJQUNULGNBQUEsMkJBQVk7SUFDWixtQkFBQSxxQ0FBaUI7SUFDakIsd0JBQUEsK0NBQXNCO0lBQ3RCLGVBQUEsNkJBQWE7SUFDYixLQUFBLFNBQUc7SUFDSCxpQkFBQSxpQ0FBZTtJQUNmLGFBQUEseUJBQVc7SUFDWCxrQkFBQSxtQ0FBZ0I7Q0FDaEIsQ0FBQzs7QUNuQkY7SUFjQyxhQUNDLGVBQWdDLEVBQ2hDLElBQXFCLEVBQ3JCLFlBQXdCLEVBQ3hCLE9BQWlCLEVBQ2pCLFNBQXFCLEVBQ3JCLE1BQWU7UUFHZixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUV0QixDQUFDO0lBRUQsa0JBQUksR0FBSixVQUFLLFFBQWdCO1FBR3BCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRy9DLElBQUksSUFBWSxDQUFDO1FBRWpCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUd0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxFQUFFLEdBQUc7WUFDUixJQUFJLEVBQUUsSUFBSTtZQUNWLGlCQUFpQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtTQUMvQyxDQUFDLENBQUM7SUFFSixDQUFDO0lBRUQsb0JBQU0sR0FBTixVQUFPLFFBQWdCO1FBR3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRy9DLElBQUksSUFBWSxDQUFDO1FBRWpCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUd0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLEdBQUc7WUFDUixJQUFJLEVBQUUsSUFBSTtZQUNWLGlCQUFpQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtTQUMvQyxDQUFDLENBQUM7SUFFSixDQUFDO0lBRUQsbUJBQUssR0FBTCxVQUFNLFdBQW1CLEVBQUUsV0FBbUIsRUFBRSxPQUFZO1FBQVosdUJBQVksR0FBWixZQUFZO1FBRzNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLEdBQUc7WUFDUixpQkFBaUIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7U0FDL0MsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELG9CQUFNLEdBQU4sVUFBTyxNQUFXO1FBR2pCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2YsTUFBTSxFQUFFLFFBQVE7WUFDaEIsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7SUFFSixDQUFDO0lBRUQsaUJBQUcsR0FBSCxVQUFJLFdBQW1CO1FBR3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2YsTUFBTSxFQUFFLEtBQUs7WUFDYixHQUFHLEVBQUUsR0FBRztZQUNSLGlCQUFpQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtTQUMvQyxDQUFDLENBQUM7SUFFSixDQUFDO0lBRU8sa0NBQW9CLEdBQTVCO1FBQUEsaUJBY0M7UUFaQSxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUd6RCxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUczRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTTtZQUU1QyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRCxDQUFDLENBQUMsQ0FBQztJQUVKLENBQUM7SUFFRixVQUFDO0FBQUQsQ0FuSUEsQUFtSUMsSUFBQTtBQW5JWSxXQUFHLE1BbUlmLENBQUE7O0FDeElEO0lBSUMsdUJBQVksVUFBd0I7UUFFbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFFL0IsQ0FBQztJQUVGLG9CQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSxxQkFBYSxnQkFVekIsQ0FBQTs7QUNWRDtJQUlDLDJCQUFZLE1BQTJCO1FBRXRDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBRXRCLENBQUM7SUFFRCxtQ0FBTyxHQUFQLFVBQVEsTUFBYztRQUVyQixJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUUvQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVmLENBQUM7SUFFRix3QkFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF4QlkseUJBQWlCLG9CQXdCN0IsQ0FBQTs7QUN4QkQ7SUFBQTtJQVVBLENBQUM7SUFSQSx3Q0FBTyxHQUFQLFVBQVEsTUFBYztRQUlyQixNQUFNLENBQUMsTUFBTSxDQUFDO0lBRWYsQ0FBQztJQUVGLDZCQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSw4QkFBc0IseUJBVWxDLENBQUE7O0FDVkQ7SUFJQyxtQkFBWSxNQUFxQjtRQUVoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUV0QixDQUFDO0lBRU0sMEJBQU0sR0FBYixVQUFjLE1BQWM7UUFFM0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUV6QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFckUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXZELENBQUM7UUFFRixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVmLENBQUM7SUFFRixnQkFBQztBQUFELENBNUJBLEFBNEJDLElBQUE7QUE1QlksaUJBQVMsWUE0QnJCLENBQUE7O0FDNUJEO0lBSUMsbUJBQVksTUFBcUI7UUFFaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFFdEIsQ0FBQztJQUVNLDBCQUFNLEdBQWIsVUFBYyxNQUFXO1FBRXhCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUU3QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakQsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFFZixDQUFDO0lBRUYsZ0JBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBeEJZLGlCQUFTLFlBd0JyQixDQUFBOztBQ3hCRDtJQUlDLHNCQUFZLEtBQWE7UUFFeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVNLCtCQUFRLEdBQWYsVUFBZ0IsTUFBYyxFQUFFLE1BQW1CO1FBQW5CLHNCQUFtQixHQUFuQixXQUFtQjtRQUdsRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FDN0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFDakMscUJBQXFCO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQy9CLENBQUM7UUFFRixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUV6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWpCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakMsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXZFLENBQUM7SUFFTyxnQ0FBUyxHQUFqQixVQUFrQixXQUFtQjtRQUVwQyxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFckIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRS9CLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV2QyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVGLENBQUM7UUFFRixDQUFDO1FBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVsRSxDQUFDO0lBRU8sbUNBQVksR0FBcEIsVUFBcUIsU0FBaUI7UUFFckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFekUsQ0FBQztJQUVPLHNDQUFlLEdBQXZCLFVBQXdCLEtBQWE7UUFFcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRixtQkFBQztBQUFELENBckVBLEFBcUVDLElBQUE7QUFyRVksb0JBQVksZUFxRXhCLENBQUE7O0FDcEVEO0lBTUMseUJBQVksU0FBcUIsRUFBRSxjQUEwQjtRQUU1RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUV0QyxDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLFFBQWEsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUVuRCxJQUFJLGVBQWUsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRW5DLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV0QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUUvQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0QsQ0FBQztnQkFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO1lBRWpCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFFUCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTlDLENBQUM7UUFFRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFFUCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5ELENBQUM7SUFFRixDQUFDO0lBRUYsc0JBQUM7QUFBRCxDQTNDQSxBQTJDQyxJQUFBO0FBM0NZLHVCQUFlLGtCQTJDM0IsQ0FBQTs7QUM5Q0Qsa0ZBQWtGO0FBSWxGLG9CQUFrQixZQUFZLENBQUMsQ0FBQTtBQU0vQixrQ0FBZ0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNqRSx1Q0FBcUMscUNBQXFDLENBQUMsQ0FBQTtBQUMzRSxnQ0FBOEIsNEJBQTRCLENBQUMsQ0FBQTtBQUMzRCxpQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUVsRCw2QkFBcUIsR0FBRyxjQUFjLENBQUM7QUFDdkMsMkJBQW1CLEdBQUcsUUFBUSxDQUFDO0FBQy9CLDhCQUFzQixHQUFHLGtCQUFrQixDQUFDO0FBQzVDLDhCQUFzQixHQUFHLFdBQVcsQ0FBQztBQUNyQyxvQ0FBNEIsR0FBRyxnQkFBZ0IsQ0FBQztBQUNoRCxrQ0FBMEIsR0FBRyxLQUFLLENBQUM7QUFDbkMscUNBQTZCLEdBQUcsU0FBUyxDQUFDO0FBS3ZEO0lBTUMseUJBQVksSUFBcUIsRUFBRSxhQUE0QjtRQUU5RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUVwQyxDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLFFBQWE7UUFFbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGtDQUEwQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQUksa0NBQTBCLHFDQUFpQyxDQUFDLENBQUM7UUFDbEYsQ0FBQztRQUdELElBQUksWUFBd0IsRUFDM0IsT0FBaUIsRUFDakIsU0FBcUIsRUFDckIsTUFBZSxFQUNmLFNBQXFCLEVBQ3JCLGNBQTBCLENBQUM7UUFFNUIsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0NBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsOEJBQXNCLEVBQUUsUUFBUSxDQUFDO1lBQzlELE9BQU8sQ0FBQyxXQUFXLENBQUMsOEJBQXNCLEVBQUUsUUFBUSxDQUFDO1lBQ3JELElBQUkscUNBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0NBQTRCLEVBQUUsUUFBUSxDQUFDO1lBQ3ZFLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0NBQTRCLEVBQUUsUUFBUSxDQUFDO1lBQzNELElBQUksK0NBQXNCLEVBQUUsQ0FBQztRQUVsQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxxQ0FBNkIsRUFBRSxRQUFRLENBQUM7WUFDbkUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxxQ0FBNkIsRUFBRSxRQUFRLENBQUM7WUFDNUQsSUFBSSxpQ0FBZSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVsRCxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyw4QkFBc0IsRUFBRSxRQUFRLENBQUM7WUFDOUQsT0FBTyxDQUFDLFdBQVcsQ0FBQyw4QkFBc0IsRUFBRSxRQUFRLENBQUM7WUFDckQsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLDJCQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTVELElBQUksUUFBYyxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsNkJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsNkJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEUsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXJFLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FDdEIsSUFBSSxFQUNKLElBQUksQ0FBQyxJQUFJLEVBQ1QsWUFBWSxFQUNaLE9BQU8sRUFDUCxTQUFTLEVBQ1QsTUFBTSxDQUNOLENBQUM7UUFFSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFFUCxRQUFRLEdBQUcsSUFBSSxTQUFHLENBQ2pCLElBQUksRUFDSixJQUFJLENBQUMsSUFBSSxFQUNULFlBQVksRUFDWixPQUFPLEVBQ1AsU0FBUyxFQUNULE1BQU0sQ0FDTixDQUFDO1FBRUgsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFFakIsQ0FBQztJQUNGLHNCQUFDO0FBQUQsQ0FoRkEsQUFnRkMsSUFBQTtBQWhGWSx1QkFBZSxrQkFnRjNCLENBQUE7O0FDMUdELGtGQUFrRjtBQUlsRixnQ0FBb0MsNEJBQTRCLENBQUMsQ0FBQTtBQUVqRTtJQUlDO1FBRUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFFckIsQ0FBQztJQUVELHlCQUFHLEdBQUgsVUFBSSxRQUFjO1FBRWpCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLHVDQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyx1Q0FBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUVoRixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHlCQUFHLEdBQUgsVUFBSSxFQUFVO1FBRWIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFM0IsQ0FBQztJQUVGLGtCQUFDO0FBQUQsQ0EvQkEsQUErQkMsSUFBQTtBQS9CWSxtQkFBVyxjQStCdkIsQ0FBQTs7QUNuQ0Q7SUFBQTtJQVFBLENBQUM7SUFOQSxvQ0FBUyxHQUFULFVBQVUsTUFBVztRQUVwQixNQUFNLENBQUMsTUFBTSxDQUFDO0lBRWYsQ0FBQztJQUVGLHVCQUFDO0FBQUQsQ0FSQSxBQVFDLElBQUE7QUFSWSx3QkFBZ0IsbUJBUTVCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtSZXNvdXJjZU1hbmFnZXJ9IGZyb20gXCIuL3NyYy9NYW5hZ2VyL1Jlc291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQge1doaXRlbGlzdH0gZnJvbSBcIi4vc3JjL0ZpbHRlci9XaGl0ZWxpc3RcIjtcclxuaW1wb3J0IHtCbGFja2xpc3R9IGZyb20gXCIuL3NyYy9GaWx0ZXIvQmxhY2tsaXN0XCI7XHJcbmltcG9ydCB7VXJsR2VuZXJhdG9yfSBmcm9tIFwiLi9zcmMvR2VuZXJhdG9yL1VybEdlbmVyYXRvclwiO1xyXG5pbXBvcnQge1Jlc3BvbnNlQ29udmVydGVyfSBmcm9tIFwiLi9zcmMvQ29udmVydGVyL1Jlc3BvbnNlQ29udmVydGVyXCI7XHJcbmltcG9ydCB7UmVzcG9uc2VFcnJvckNvbnZlcnRlcn0gZnJvbSBcIi4vc3JjL0NvbnZlcnRlci9SZXNwb25zZUVycm9yQ29udmVydGVyXCI7XHJcbmltcG9ydCB7Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4vc3JjL0NvbmZpZ3VyYXRpb24vQ29uZmlndXJhdGlvblwiO1xyXG5pbXBvcnQge0FwaX0gZnJvbSBcIi4vc3JjL0FwaS9BcGlcIjtcclxuaW1wb3J0IHtSZXNwb25zZUhhbmRsZXJ9IGZyb20gXCIuL3NyYy9IYW5kbGVyL1Jlc3BvbnNlSGFuZGxlclwiO1xyXG5pbXBvcnQge0FwaVJlZ2lzdHJ5fSBmcm9tIFwiLi9zcmMvUmVnaXN0cnkvQXBpUmVnaXN0cnlcIjtcclxuaW1wb3J0IHtSZXF1ZXN0VHJhbnNmb3JtfSBmcm9tIFwiLi9zcmMvVHJhbnNmb3JtL1JlcXVlc3RUcmFuc2Zvcm1cIjtcclxuXHJcbmxldCBnbG9iYWw6IGFueSA9IHdpbmRvdztcclxuXHJcbmdsb2JhbC5helJlc291cmNlID0ge1xyXG5cdFJlc291cmNlTWFuYWdlcixcclxuXHRXaGl0ZWxpc3QsXHJcblx0QmxhY2tsaXN0LFxyXG5cdFVybEdlbmVyYXRvcixcclxuXHRSZXNwb25zZUNvbnZlcnRlcixcclxuXHRSZXNwb25zZUVycm9yQ29udmVydGVyLFxyXG5cdENvbmZpZ3VyYXRpb24sXHJcblx0QXBpLFxyXG5cdFJlc3BvbnNlSGFuZGxlcixcclxuXHRBcGlSZWdpc3RyeSxcclxuXHRSZXF1ZXN0VHJhbnNmb3JtXHJcbn07IiwiaW1wb3J0IHtJQXBpfSBmcm9tIFwiLi9JQXBpXCI7XHJcbmltcG9ydCB7UmVzb3VyY2VNYW5hZ2VyfSBmcm9tIFwiLi4vTWFuYWdlci9SZXNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IHtJR2VuZXJhdG9yfSBmcm9tIFwiLi4vR2VuZXJhdG9yL0lHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHtJRmlsdGVyfSBmcm9tIFwiLi4vRmlsdGVyL0lGaWx0ZXJcIjtcclxuaW1wb3J0IHtJSGFuZGxlcn0gZnJvbSBcIi4uL0hhbmRsZXIvSUhhbmRsZXJcIjtcclxuaW1wb3J0IHtJVHJhbnNmb3JtfSBmcm9tIFwiLi4vVHJhbnNmb3JtL0lUcmFuc2Zvcm1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcGkgaW1wbGVtZW50cyBJQXBpIHtcclxuXHRcclxuXHRwdWJsaWMgcmVzb3VyY2VNYW5hZ2VyOiBSZXNvdXJjZU1hbmFnZXI7XHJcblx0XHRcclxuXHRwcml2YXRlIGh0dHA6IG5nLklIdHRwU2VydmljZTtcclxuXHRcclxuXHRwdWJsaWMgdXJsR2VuZXJhdG9yOiBJR2VuZXJhdG9yO1xyXG5cdFxyXG5cdHB1YmxpYyBmaWx0ZXI6IElGaWx0ZXI7XHJcblx0XHJcblx0cHVibGljIGhhbmRsZXI6IElIYW5kbGVyO1xyXG5cdFxyXG5cdHB1YmxpYyB0cmFuc2Zvcm06IElUcmFuc2Zvcm07XHJcblx0XHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHRyZXNvdXJjZU1hbmFnZXI6IFJlc291cmNlTWFuYWdlcixcclxuXHRcdGh0dHA6IG5nLklIdHRwU2VydmljZSxcclxuXHRcdHVybEdlbmVyYXRvcjogSUdlbmVyYXRvcixcclxuXHRcdGhhbmRsZXI6IElIYW5kbGVyLFxyXG5cdFx0dHJhbnNmb3JtOiBJVHJhbnNmb3JtLFxyXG5cdFx0ZmlsdGVyOiBJRmlsdGVyXHJcblx0KSB7XHJcblx0XHRcclxuXHRcdHRoaXMucmVzb3VyY2VNYW5hZ2VyID0gcmVzb3VyY2VNYW5hZ2VyO1xyXG5cdFx0dGhpcy5odHRwID0gaHR0cDtcclxuXHRcdHRoaXMudXJsR2VuZXJhdG9yID0gdXJsR2VuZXJhdG9yO1xyXG5cdFx0dGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcclxuXHRcdHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG5cdFx0dGhpcy5maWx0ZXIgPSBmaWx0ZXI7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0c2F2ZShyZXNvdXJjZTogT2JqZWN0KTogbmcuSUh0dHBQcm9taXNlPGFueT4ge1xyXG5cdFx0XHJcblx0XHQvLyBHZW5lcmF0ZSB1cmwgZnJvbSBwYXJhbWV0ZXJzXHJcblx0XHRsZXQgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGUocmVzb3VyY2UpO1xyXG5cdFx0XHJcblx0XHQvLyBGaWx0ZXIgcmVzb3VyY2UgZmllbGRzIGZvciByZXF1ZXN0IGFuZCB0cmFuc2Zvcm0gdGhlbSB0byBmaW5hbCBmb3JtXHJcblx0XHRsZXQgZGF0YTogT2JqZWN0O1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5maWx0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRkYXRhID0gdGhpcy5maWx0ZXIuZmlsdGVyKHJlc291cmNlKTtcclxuXHRcdH1cclxuXHRcdGRhdGEgPSB0aGlzLnRyYW5zZm9ybS50cmFuc2Zvcm0oZGF0YSk7XHJcblx0XHRcclxuXHRcdC8vIE1ha2UgQVBJIHJlcXVlc3QgZm9yIHJlc291cmNlIGFuZCBzZXQgc2VyaWFsaXphdGlvbiBtZXRob2RcclxuXHRcdHJldHVybiB0aGlzLmh0dHAoe1xyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0dHJhbnNmb3JtUmVzcG9uc2U6IHRoaXMuZ2V0VHJhbnNmb3JtUmVzcG9uc2UoKVxyXG5cdFx0fSk7XHJcblx0XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZShyZXNvdXJjZTogT2JqZWN0KTogbmcuSUh0dHBQcm9taXNlPGFueT4ge1xyXG5cdFx0XHJcblx0XHQvLyBHZW5lcmF0ZSB1cmwgZnJvbSBwYXJhbWV0ZXJzXHJcblx0XHRsZXQgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGUocmVzb3VyY2UpO1xyXG5cdFx0XHJcblx0XHQvLyBGaWx0ZXIgcmVzb3VyY2UgZmllbGRzIGZvciByZXF1ZXN0IGFuZCB0cmFuc2Zvcm0gdGhlbSB0byBmaW5hbCBmb3JtXHJcblx0XHRsZXQgZGF0YTogT2JqZWN0O1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5maWx0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRkYXRhID0gdGhpcy5maWx0ZXIuZmlsdGVyKHJlc291cmNlKTtcclxuXHRcdH1cclxuXHRcdGRhdGEgPSB0aGlzLnRyYW5zZm9ybS50cmFuc2Zvcm0oZGF0YSk7XHJcblx0XHRcclxuXHRcdC8vIE1ha2UgQVBJIHJlcXVlc3QgZm9yIHJlc291cmNlIGFuZCBzZXQgc2VyaWFsaXphdGlvbiBtZXRob2RcclxuXHRcdHJldHVybiB0aGlzLmh0dHAoe1xyXG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0ZGF0YTogZGF0YSxcclxuXHRcdFx0XHR0cmFuc2Zvcm1SZXNwb25zZTogdGhpcy5nZXRUcmFuc2Zvcm1SZXNwb25zZSgpXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRxdWVyeShyb3V0ZVBhcmFtczogT2JqZWN0LCBxdWVyeVBhcmFtczogT2JqZWN0LCBoZWFkZXJzID0ge30pOiBuZy5JSHR0cFByb21pc2U8YW55PiB7XHJcblx0XHRcclxuXHRcdC8vIEdlbmVyYXRlIHVybCBmcm9tIHBhcmFtZXRlcnNcclxuXHRcdGxldCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZShyb3V0ZVBhcmFtcywgcXVlcnlQYXJhbXMpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5odHRwKHtcclxuXHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdHRyYW5zZm9ybVJlc3BvbnNlOiB0aGlzLmdldFRyYW5zZm9ybVJlc3BvbnNlKClcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRyZW1vdmUoZW50aXR5OiBhbnkpOiBuZy5JSHR0cFByb21pc2U8YW55PiB7XHJcblx0XHRcclxuXHRcdC8vIEdlbmVyYXRlIHVybCBmcm9tIHBhcmFtZXRlcnNcclxuXHRcdGxldCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZShlbnRpdHkpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5odHRwKHtcclxuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxyXG5cdFx0XHRcdHVybDogdXJsXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRnZXQocm91dGVQYXJhbXM6IE9iamVjdCk6IG5nLklIdHRwUHJvbWlzZTxhbnk+IHtcclxuXHRcdFxyXG5cdFx0Ly8gR2VuZXJhdGUgdXJsIGZyb20gcGFyYW1ldGVyc1xyXG5cdFx0bGV0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlKHJvdXRlUGFyYW1zKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuaHR0cCh7XHJcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0XHR0cmFuc2Zvcm1SZXNwb25zZTogdGhpcy5nZXRUcmFuc2Zvcm1SZXNwb25zZSgpXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIGdldFRyYW5zZm9ybVJlc3BvbnNlKCkge1xyXG5cdFx0XHJcblx0XHRsZXQgZGVmYXVsdHM6IGFueSA9IHRoaXMuaHR0cC5kZWZhdWx0cy50cmFuc2Zvcm1SZXNwb25zZTtcclxuXHRcdFxyXG5cdFx0Ly8gTWFrZSBzdXJlIGlzIGFycmF5XHJcblx0XHRkZWZhdWx0cyA9IEFycmF5LmlzQXJyYXkoZGVmYXVsdHMpID8gZGVmYXVsdHMgOiBbZGVmYXVsdHNdO1xyXG5cdFx0XHJcblx0XHQvLyBBZGQgY29udmVyc2lvbiB0byByZXF1ZXN0XHJcblx0XHRyZXR1cm4gZGVmYXVsdHMuY29uY2F0KChyZXNwLCBoZWFkZXJzLCBzdGF0dXMpID0+IHtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB0aGlzLmhhbmRsZXIuaGFuZGxlKHJlc3AsIGhlYWRlcnMsIHN0YXR1cyk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0iLCJpbXBvcnQge0lBcGlSZWdpc3RyeX0gZnJvbSBcIi4uL1JlZ2lzdHJ5L0lBcGlSZWdpc3RyeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb24ge1xyXG5cdFxyXG5cdHB1YmxpYyBhcGlSZWdpc3RyeTogSUFwaVJlZ2lzdHJ5OyBcclxuXHRcclxuXHRjb25zdHJ1Y3RvcihhcGlSZWdpc3R5OiBJQXBpUmVnaXN0cnkpIHtcclxuXHRcdFxyXG5cdFx0dGhpcy5hcGlSZWdpc3RyeSA9IGFwaVJlZ2lzdHk7XHJcblx0XHJcblx0fVxyXG5cdFxyXG59IiwiaW1wb3J0IHtJQ29udmVydGVyfSBmcm9tIFwiLi9JQ29udmVydGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVzcG9uc2VDb252ZXJ0ZXIgaW1wbGVtZW50cyBJQ29udmVydGVyIHtcclxuXHRcclxuXHRwcml2YXRlIEVudGl0eTogRnVuY3Rpb25Db25zdHJ1Y3RvcjtcclxuXHRcclxuXHRjb25zdHJ1Y3RvcihFbnRpdHk6IEZ1bmN0aW9uQ29uc3RydWN0b3IpIHtcclxuXHRcdFxyXG5cdFx0dGhpcy5FbnRpdHkgPSBFbnRpdHk7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0Y29udmVydChvYmplY3Q6IE9iamVjdCk6IE9iamVjdCB7XHJcblx0XHRcclxuXHRcdGxldCBlbnRpdHkgPSBuZXcgdGhpcy5FbnRpdHkoKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgcHJvcGVydHkgaW4gZW50aXR5KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRlbnRpdHlbcHJvcGVydHldID0gZW50aXR5W3Byb3BlcnR5XTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBlbnRpdHk7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0iLCJpbXBvcnQge0lDb252ZXJ0ZXJ9IGZyb20gXCIuL0lDb252ZXJ0ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNwb25zZUVycm9yQ29udmVydGVyIGltcGxlbWVudHMgSUNvbnZlcnRlciB7XHJcblx0XHJcblx0Y29udmVydChvYmplY3Q6IE9iamVjdCk6IE9iamVjdCB7XHJcblx0XHRcclxuXHRcdC8vIEZvciBub3cgb25seSBwYXNzIHRoZSBkYXRhIGZyb20gQVBJXHJcblx0XHQvLyBUT0RPOiBQcmVwYXJlIGRlZmF1bHQgY29udmVyc3Rpb24gZm9yIGVycm9yc1xyXG5cdFx0cmV0dXJuIG9iamVjdDtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxufSIsImltcG9ydCB7SUZpbHRlcn0gZnJvbSBcIi4vSUZpbHRlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgQmxhY2tsaXN0IGltcGxlbWVudHMgSUZpbHRlciB7XHJcblx0XHJcblx0cHJpdmF0ZSBmaWVsZHM6IEFycmF5PHN0cmluZz47XHJcblx0XHJcblx0Y29uc3RydWN0b3IoZmllbGRzOiBBcnJheTxzdHJpbmc+KSB7XHJcblx0XHJcblx0XHR0aGlzLmZpZWxkcyA9IGZpZWxkcztcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRwdWJsaWMgZmlsdGVyKG9iamVjdDogT2JqZWN0KTogT2JqZWN0IHtcclxuXHRcdFxyXG5cdFx0bGV0IHJlc3VsdCA9IHt9O1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBwcm9wIGluIG9iamVjdCkge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiB0aGlzLmZpZWxkcy5pbmRleE9mKHByb3ApID09PSAtMSkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJlc3VsdFt0aGlzLmZpZWxkc1twcm9wXV0gPSBvYmplY3RbdGhpcy5maWVsZHNbcHJvcF1dO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IiwiaW1wb3J0IHtJRmlsdGVyfSBmcm9tICcuL0lGaWx0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoaXRlbGlzdCBpbXBsZW1lbnRzIElGaWx0ZXIge1xyXG5cdFxyXG5cdHByaXZhdGUgZmllbGRzOiBBcnJheTxzdHJpbmc+O1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKGZpZWxkczogQXJyYXk8c3RyaW5nPikge1xyXG5cdFx0XHJcblx0XHR0aGlzLmZpZWxkcyA9IGZpZWxkcztcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRwdWJsaWMgZmlsdGVyKG9iamVjdDogYW55KTogT2JqZWN0IHtcclxuXHRcdFxyXG5cdFx0bGV0IHJlc3VsdCA9IHt9O1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmllbGRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdHJlc3VsdFt0aGlzLmZpZWxkc1tpXV0gPSBvYmplY3RbdGhpcy5maWVsZHNbaV1dO1xyXG5cdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IiwiaW1wb3J0IHtJR2VuZXJhdG9yfSBmcm9tIFwiLi9JR2VuZXJhdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXJsR2VuZXJhdG9yIGltcGxlbWVudHMgSUdlbmVyYXRvciB7XHJcblx0XHJcblx0cHJpdmF0ZSByb3V0ZTogc3RyaW5nO1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHJvdXRlOiBzdHJpbmcpIHtcclxuXHRcdFxyXG5cdFx0dGhpcy5yb3V0ZSA9IHJvdXRlO1xyXG5cdH1cclxuXHRcclxuXHRwdWJsaWMgZ2VuZXJhdGUoZW50aXR5OiBPYmplY3QsIHBhcmFtczogT2JqZWN0ID0ge30pOiBzdHJpbmcge1xyXG5cdFx0XHJcblx0XHQvLyBtYXRjaCBwYXJhbWV0ZXJzXHJcblx0XHRsZXQgbWF0Y2hlcyA9IHRoaXMucm91dGUuc3BsaXQoXHJcblx0XHRcdG5ldyBSZWdFeHAodGhpcy5yZWdFeHBFc2NhcGUoJ3snKSArXHJcblx0XHRcdCcoKD86LnxbXFxyXFxuXSkrPykoPzonICtcclxuXHRcdFx0dGhpcy5yZWdFeHBFc2NhcGUoJ30nKSArICd8JCknKVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpICUgMiA9PT0gMSkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdG1hdGNoZXNbaV0gPSBlbnRpdHlbbWF0Y2hlc1tpXV07XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJlc3VsdC5wdXNoKG1hdGNoZXNbaV0pO1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlTGFzdFNsYXNoKHJlc3VsdC5qb2luKCcnKSkgKyB0aGlzLnNlcmlhbGl6ZShwYXJhbXMpO1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgc2VyaWFsaXplKHF1ZXJ5UGFyYW1zOiBPYmplY3QpIHtcclxuXHRcdFxyXG5cdFx0dmFyIHF1ZXJ5U3RyaW5nID0gW107XHJcblx0XHRcclxuXHRcdGZvciAobGV0IHBhcmFtIGluIHF1ZXJ5UGFyYW1zKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAocXVlcnlQYXJhbXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cXVlcnlTdHJpbmcucHVzaChlbmNvZGVVUklDb21wb25lbnQocGFyYW0pICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5UGFyYW1zW3BhcmFtXSkpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fSBcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nLmxlbmd0aCA+IDAgPyAnPycgKyBxdWVyeVN0cmluZy5qb2luKCcmJykgOiAnJztcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIHJlZ0V4cEVzY2FwZShleHByZXNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRcclxuXHRcdHJldHVybiBTdHJpbmcoZXhwcmVzaW9uKS5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpO1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgcmVtb3ZlTGFzdFNsYXNoKHJvdXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0XHJcblx0XHRpZiAocm91dGVbcm91dGUubGVuZ3RoIC0gMV0gPT09ICcvJykge1xyXG5cdFx0XHRyZXR1cm4gcm91dGUuc3Vic3RyaW5nKDAsIHJvdXRlLmxlbmd0aCAtIDEpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcm91dGU7XHJcblx0fVxyXG5cdFxyXG59IiwiaW1wb3J0IHtJQ29udmVydGVyfSBmcm9tIFwiLi4vQ29udmVydGVyL0lDb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHtJSGFuZGxlcn0gZnJvbSBcIi4vSUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNwb25zZUhhbmRsZXIgaW1wbGVtZW50cyBJSGFuZGxlciB7XHJcblx0XHRcclxuXHRwcml2YXRlIGNvbnZlcnRlcjogSUNvbnZlcnRlcjtcclxuXHRcclxuXHRwcml2YXRlIGVycm9yQ29udmVydGVyOiBJQ29udmVydGVyO1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKGNvbnZlcnRlcjogSUNvbnZlcnRlciwgZXJyb3JDb252ZXJ0ZXI6IElDb252ZXJ0ZXIpIHtcclxuXHRcdFxyXG5cdFx0dGhpcy5jb252ZXJ0ZXIgPSBjb252ZXJ0ZXI7XHJcblx0XHR0aGlzLmVycm9yQ29udmVydGVyID0gZXJyb3JDb252ZXJ0ZXI7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0aGFuZGxlKHJlc3BvbnNlOiBhbnksIGhlYWRlcjogT2JqZWN0LCBzdGF0dXM6IG51bWJlcik6IGFueSB7XHJcblx0XHRcclxuXHRcdGxldCBpc0Vycm9yUmVzcG9uc2UgPSBzdGF0dXMgPiA0MDA7XHJcblx0XHRcclxuXHRcdGlmICghaXNFcnJvclJlc3BvbnNlKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZS5kYXRhKSkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhW2ldID0gdGhpcy5jb252ZXJ0ZXIuY29udmVydChyZXNwb25zZS5kYXRhW2ldKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHRcdFx0XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29udmVydGVyLmNvbnZlcnQocmVzcG9uc2UuZGF0YSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXJyb3JDb252ZXJ0ZXIuY29udmVydChyZXNwb25zZS5kYXRhKTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3JlZmxlY3QtbWV0YWRhdGEvcmVmbGVjdC1tZXRhZGF0YS5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCB7Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL0NvbmZpZ3VyYXRpb24vQ29uZmlndXJhdGlvblwiO1xyXG5pbXBvcnQge0lBcGl9IGZyb20gXCIuLi9BcGkvSUFwaVwiO1xyXG5pbXBvcnQge0FwaX0gZnJvbSBcIi4uL0FwaS9BcGlcIjtcclxuaW1wb3J0IHtJR2VuZXJhdG9yfSBmcm9tIFwiLi4vR2VuZXJhdG9yL0lHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHtJSGFuZGxlcn0gZnJvbSBcIi4uL0hhbmRsZXIvSUhhbmRsZXJcIjtcclxuaW1wb3J0IHtJVHJhbnNmb3JtfSBmcm9tIFwiLi4vVHJhbnNmb3JtL0lUcmFuc2Zvcm1cIjtcclxuaW1wb3J0IHtJRmlsdGVyfSBmcm9tIFwiLi4vRmlsdGVyL0lGaWx0ZXJcIjtcclxuaW1wb3J0IHtJQ29udmVydGVyfSBmcm9tIFwiLi4vQ29udmVydGVyL0lDb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHtSZXNwb25zZUNvbnZlcnRlcn0gZnJvbSBcIi4uL0NvbnZlcnRlci9SZXNwb25zZUNvbnZlcnRlclwiO1xyXG5pbXBvcnQge1Jlc3BvbnNlRXJyb3JDb252ZXJ0ZXJ9IGZyb20gXCIuLi9Db252ZXJ0ZXIvUmVzcG9uc2VFcnJvckNvbnZlcnRlclwiO1xyXG5pbXBvcnQge1Jlc3BvbnNlSGFuZGxlcn0gZnJvbSBcIi4uL0hhbmRsZXIvUmVzcG9uc2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7UmVxdWVzdFRyYW5zZm9ybX0gZnJvbSBcIi4uL1RyYW5zZm9ybS9SZXF1ZXN0VHJhbnNmb3JtXCI7XHJcblxyXG5leHBvcnQgY29uc3QgUkVGTEVDVF9SRVNPVVJDRV9OQU1FID0gJ1Jlc291cmNlTmFtZSc7XHJcbmV4cG9ydCBjb25zdCBSRUZMRUNUX0ZJTFRFUl9OQU1FID0gJ0ZpbHRlcic7XHJcbmV4cG9ydCBjb25zdCBSRUZMRUNUX1RSQU5TRk9STV9OQU1FID0gJ1RyYW5zZm9ybVJlcXVlc3QnO1xyXG5leHBvcnQgY29uc3QgUkVGTEVDVF9DT05WRVJURVJfTkFNRSA9ICdDb252ZXJ0ZXInO1xyXG5leHBvcnQgY29uc3QgUkVGTEVDVF9FUlJPUl9DT05WRVJURVJfTkFNRSA9ICdFcnJvckNvbnZlcnRlcic7XHJcbmV4cG9ydCBjb25zdCBSRUZMRUNUX1VSTF9HRU5FUkFUT1JfTkFNRSA9ICdVcmwnOyBcclxuZXhwb3J0IGNvbnN0IFJFRkxFQ1RfUkVTUE9OU0VfSEFORExFUl9OQU1FID0gJ0hhbmRsZXInO1xyXG5cclxuLyoqXHJcbiAqIGNsYXNzIFJlc291cmNlTWFuYWdlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlTWFuYWdlciB7XHJcblx0XHJcblx0cHJpdmF0ZSBodHRwOiBuZy5JSHR0cFNlcnZpY2U7XHJcblx0XHJcblx0cHJpdmF0ZSBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKGh0dHA6IG5nLklIdHRwU2VydmljZSwgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbikge1xyXG5cdFx0XHJcblx0XHR0aGlzLmh0dHAgPSBodHRwO1xyXG5cdFx0dGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRjcmVhdGUoUmVzb3VyY2U6IGFueSk6IElBcGkge1xyXG5cdFx0XHJcblx0XHRpZiAoIVJlZmxlY3QuaGFzTWV0YWRhdGEoUkVGTEVDVF9VUkxfR0VORVJBVE9SX05BTUUsIFJlc291cmNlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFwiJHtSRUZMRUNUX1VSTF9HRU5FUkFUT1JfTkFNRX1cIiBtZXRhZGF0YSBtaXNzaW5nIGZvciByZXNvdXJjZWApO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBSZWFkIG1ldGFkYXRhIHRvIHNldCByZXNvdXJjZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzXHJcblx0XHRsZXQgdXJsR2VuZXJhdG9yOiBJR2VuZXJhdG9yLFxyXG5cdFx0XHRoYW5kbGVyOiBJSGFuZGxlcixcclxuXHRcdFx0dHJhbnNmb3JtOiBJVHJhbnNmb3JtLFxyXG5cdFx0XHRmaWx0ZXI6IElGaWx0ZXIsXHJcblx0XHRcdGNvbnZlcnRlcjogSUNvbnZlcnRlcixcclxuXHRcdFx0ZXJyb3JDb252ZXJ0ZXI6IElDb252ZXJ0ZXI7XHJcblx0XHRcclxuXHRcdHVybEdlbmVyYXRvciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUkVGTEVDVF9VUkxfR0VORVJBVE9SX05BTUUsIFJlc291cmNlKTtcclxuXHRcdFxyXG5cdFx0Y29udmVydGVyID0gUmVmbGVjdC5oYXNNZXRhZGF0YShSRUZMRUNUX0NPTlZFUlRFUl9OQU1FLCBSZXNvdXJjZSkgP1xyXG5cdFx0XHRcdFx0UmVmbGVjdC5nZXRNZXRhZGF0YShSRUZMRUNUX0NPTlZFUlRFUl9OQU1FLCBSZXNvdXJjZSkgOlxyXG5cdFx0XHRcdFx0bmV3IFJlc3BvbnNlQ29udmVydGVyKFJlc291cmNlKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0ZXJyb3JDb252ZXJ0ZXIgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFJFRkxFQ1RfRVJST1JfQ09OVkVSVEVSX05BTUUsIFJlc291cmNlKSA/XHJcblx0XHRcdFx0XHRcdFx0UmVmbGVjdC5nZXRNZXRhZGF0YShSRUZMRUNUX0VSUk9SX0NPTlZFUlRFUl9OQU1FLCBSZXNvdXJjZSkgOlxyXG5cdFx0XHRcdFx0XHRcdG5ldyBSZXNwb25zZUVycm9yQ29udmVydGVyKCk7XHJcblx0XHRcclxuXHRcdGhhbmRsZXIgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFJFRkxFQ1RfUkVTUE9OU0VfSEFORExFUl9OQU1FLCBSZXNvdXJjZSkgP1xyXG5cdFx0XHRcdFx0UmVmbGVjdC5nZXRNZXRhZGF0YShSRUZMRUNUX1JFU1BPTlNFX0hBTkRMRVJfTkFNRSwgUmVzb3VyY2UpIDpcclxuXHRcdFx0XHRcdG5ldyBSZXNwb25zZUhhbmRsZXIoY29udmVydGVyLCBlcnJvckNvbnZlcnRlcik7XHJcblx0XHRcdFx0XHRcclxuXHRcdHRyYW5zZm9ybSA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoUkVGTEVDVF9UUkFOU0ZPUk1fTkFNRSwgUmVzb3VyY2UpID9cclxuXHRcdFx0XHRcdFJlZmxlY3QuZ2V0TWV0YWRhdGEoUkVGTEVDVF9UUkFOU0ZPUk1fTkFNRSwgUmVzb3VyY2UpIDpcclxuXHRcdFx0XHRcdG5ldyBSZXF1ZXN0VHJhbnNmb3JtKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdGZpbHRlciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUkVGTEVDVF9GSUxURVJfTkFNRSwgUmVzb3VyY2UpO1xyXG5cdFx0XHJcblx0XHRsZXQgcmVzb3VyY2U6IElBcGk7XHJcblx0XHRcclxuXHRcdGlmIChSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFJFRkxFQ1RfUkVTT1VSQ0VfTkFNRSwgUmVzb3VyY2UpKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgcmVzb3VyY2VOYW1lID0gUmVmbGVjdC5nZXRNZXRhZGF0YShSRUZMRUNUX1JFU09VUkNFX05BTUUsIFJlc291cmNlKTtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBBcGlDbGFzczogYW55ID0gdGhpcy5jb25maWd1cmF0aW9uLmFwaVJlZ2lzdHJ5LmdldChyZXNvdXJjZU5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmVzb3VyY2UgPSBuZXcgQXBpQ2xhc3MoXHJcblx0XHRcdFx0dGhpcyxcclxuXHRcdFx0XHR0aGlzLmh0dHAsXHJcblx0XHRcdFx0dXJsR2VuZXJhdG9yLFxyXG5cdFx0XHRcdGhhbmRsZXIsXHJcblx0XHRcdFx0dHJhbnNmb3JtLFxyXG5cdFx0XHRcdGZpbHRlclx0XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0XHJcblx0XHRcdHJlc291cmNlID0gbmV3IEFwaShcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdHRoaXMuaHR0cCxcclxuXHRcdFx0XHR1cmxHZW5lcmF0b3IsXHJcblx0XHRcdFx0aGFuZGxlcixcclxuXHRcdFx0XHR0cmFuc2Zvcm0sXHJcblx0XHRcdFx0ZmlsdGVyXHRcclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXNvdXJjZTtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9yZWZsZWN0LW1ldGFkYXRhL3JlZmxlY3QtbWV0YWRhdGEuZC50c1wiIC8+XHJcblxyXG5pbXBvcnQge0lBcGlSZWdpc3RyeX0gZnJvbSBcIi4vSUFwaVJlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7SUFwaX0gZnJvbSBcIi4uL0FwaS9JQXBpXCI7XHJcbmltcG9ydCB7UkVGTEVDVF9SRVNPVVJDRV9OQU1FfSBmcm9tIFwiLi4vTWFuYWdlci9SZXNvdXJjZU1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlSZWdpc3RyeSBpbXBsZW1lbnRzIElBcGlSZWdpc3RyeSB7XHJcblx0XHJcblx0cHJpdmF0ZSByZXNvdXJjZXM6IE9iamVjdDtcclxuXHRcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdFxyXG5cdFx0dGhpcy5yZXNvdXJjZXMgPSB7fTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRhZGQocmVzb3VyY2U6IElBcGkpOiBJQXBpUmVnaXN0cnkge1xyXG5cdFx0XHJcblx0XHRpZiAocmVzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Jlc291cmNlIGNhblxcJ3QgYmUgdW5kZWZpbmVkJyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghUmVmbGVjdC5oYXNNZXRhZGF0YShSRUZMRUNUX1JFU09VUkNFX05BTUUsIHJlc291cmNlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01ldGFkYXRhIG1pc3NpbmcgZm9yIFJlc291cmNlIGNsYXNzJyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMucmVzb3VyY2VzW1JlZmxlY3QuZ2V0TWV0YWRhdGEoUkVGTEVDVF9SRVNPVVJDRV9OQU1FLCByZXNvdXJjZSldID0gcmVzb3VyY2U7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRnZXQoaWQ6IHN0cmluZyk6IEZ1bmN0aW9uQ29uc3RydWN0b3Ige1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcy5yZXNvdXJjZXNbaWRdO1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IiwiaW1wb3J0IHtJVHJhbnNmb3JtfSBmcm9tIFwiLi9JVHJhbnNmb3JtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVxdWVzdFRyYW5zZm9ybSBpbXBsZW1lbnRzIElUcmFuc2Zvcm0ge1xyXG5cdFxyXG5cdHRyYW5zZm9ybShvYmplY3Q6IGFueSk6IE9iamVjdCB7XHJcblx0XHRcclxuXHRcdHJldHVybiBvYmplY3Q7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn1cclxuIl19

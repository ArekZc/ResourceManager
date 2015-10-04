# ResourceManager 
[![Build Status](https://travis-ci.org/ArekZc/ResourceManager.svg)](https://travis-ci.org/ArekZc/ResourceManager)
> easy to use model based REST API client

## Installation
```sh
npm install arekzc-resource
```

## Example

### Typescript
```javascript
// Model of
@Reflect.metadata('Url', new arekzc.resource.resource.UrlGenerator('/books/{id}'))
class Book {
	
	public id: number;
	
	public title: string;
	
}

// For this example i use angular $http service but you could
// replace it with other with similar interface
let http = angular.injector(['ng']).get('$http');
// Registry for new Resource classes
let registry = new arekzc.resource.registry.ResourceRegistry();
// Create configuration to set defaults for resourceManager service
let configuration = new arekzc.resource.configuration.Configuration(registry);
// Create instance of resource with provided services
let resourceManager = new arekzc.resource.ResourceManager(http, configuration);
// Get new resource based on metadata added by Reflect library
resourceManager.getResource(Book).get(1);
```

### Javascript

```javascript

function Book() {
	
	this.id = undefined;
	
	this.title = undefined;
}

Reflect.defineMetadata('Url', new arekzc.resource.resource.UrlGenerator('/books/{id}'), Book)
// For this example i use angular $http service but you could
// replace it with other with similar interface
var http = angular.injector(['ng']).get('$http');
// Registry for new Resource classes
var registry = new arekzc.resource.registry.ResourceRegistry();
// Create configuration to set defaults for resourceManager service
var configuration = new arekzc.resource.configuration.Configuration(registry);
// Create instance of resource with provided services
var resourceManager = new arekzc.resource.ResourceManager(http, configuration);

resourceManager.getResource(Book).get(1);
```

## API

### Metadata

```javascript
// Required: Define route generator used to generate url for http service
// parameters passed in route are fields in model
@Reflect.metadata('Url', new arekzc.resource.resource.UrlGenerator('/books/{id}')
// Optional: Convert response data to provided model
@Reflect.metadata('Converter', new arekzc.resource.converter.ResponseConverter())
// Optional: Convert error response
@Reflect.metadata('ErrorConverter', new arekzc.resource.converter.ResponseErrorConverter())
// Optional: Remove unnecessary fields from request body
// You can use one of defined one Whitelist or Blacklist or create yours
@Reflect.metadata('Filter', new arekzc.resource.filter.Whitelist(['title']))
// Optional: Name of resource used for request
@Reflect.metadata('ResourceName', 'NameOfRegistredResource')
// Optional: Normalize request data fields
@Reflect.metadata('TransformRequest', new arekzc.resource.transform.RequestTransform())
```

### Default resource

```javascript
let resource = resourceManager.getResource(Book);

let book = new Book();

book.id = 1;
book.title = 'Harry Potter';

resource.save(book);
resource.get(book.id);
resource.query({}, {q: 'Harry'});
resource.update(book);
resource.remove(book);
```

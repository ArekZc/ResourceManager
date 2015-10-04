/// <reference path="../../../node_modules/definitively-typed/jasmine/jasmine.d.ts" />
/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../../src/Registry/ResourceRegistry.ts" />
/// <reference path="../../../src/Resource/ApiResource.ts" />

describe('Unit: ResourceRegistry', () => {
	
	let resourceRegsitry: arekzc.resource.registry.ResourceRegistry;
	
	beforeEach(() => {
		
		resourceRegsitry = new arekzc.resource.registry.ResourceRegistry();
		
	});
	
	it('should be defined', () => {
		
		expect(arekzc.resource.registry.ResourceRegistry).toBeDefined();
		
	});
	
	it('should be instantiated', () => {
		
		expect(resourceRegsitry instanceof arekzc.resource.registry.ResourceRegistry).toBeTruthy();
		
	});
	
	describe('method "add"', () => {
		
		it('should be defined', () => {
			
			expect(resourceRegsitry.add).toBeDefined();
			
		});
		
		it('should throw error when pass undefined', () => {
			
			spyOn(resourceRegsitry, 'add').and.throwError('Resource can\'t be undefined')
			
			expect(() => {
				resourceRegsitry.add(undefined);
			}).toThrowError('Resource can\'t be undefined')
			
		});
		
		it('should throw error when metadata missing', () => {
			
			let resource = new arekzc.resource.resource.ApiResource(undefined, undefined, undefined, undefined, undefined, undefined);
			
			spyOn(resourceRegsitry, 'add').and.throwError('Metadata missing for Resource class');
			
			expect(() => {
				resourceRegsitry.add(resource);
			}).toThrowError('Metadata missing for Resource class');
			
		});
		
		it('should add resource to registry', () => {
			
			let resource = new arekzc.resource.resource.ApiResource(undefined, undefined, undefined, undefined, undefined, undefined);
			
			Reflect.defineMetadata('ResourceName', 'Default', resource);
			
			resourceRegsitry.add(resource);
			
			expect(resourceRegsitry.get('Default')).toBe(resource);
			
		});
		
		it('should return instance of itself', () => {
			
			let resource = new arekzc.resource.resource.ApiResource(undefined, undefined, undefined, undefined, undefined, undefined);
			
			Reflect.defineMetadata('ResourceName', 'Default', resource);
			
			expect(resourceRegsitry.add(resource) instanceof arekzc.resource.registry.ResourceRegistry).toBeTruthy();
			
		});
		
	});
	
});
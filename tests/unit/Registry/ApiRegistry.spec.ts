/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

describe('Unit: ApiRegistry class', () => {
	
	let global: any = window,
		ApiRegistry = global.azResource.ApiRegistry,
		Api = global.azResource.Api,
		registry: any;
	
	it('should be defined', () => {
		
		expect(ApiRegistry).toBeDefined();
		
	});
	
	it('should be instantiated', () => {
		
		registry = new ApiRegistry();
		
		expect(registry instanceof ApiRegistry).toBeTruthy();
		
	});
	
	describe('method "add"', () => {
		
		it('should be defined', () => {
			
			expect(registry.add).toBeDefined();
			
		});
		
		it('should throw error when pass undefined', () => {
			
			spyOn(registry, 'add').and.throwError('Resource can\'t be undefined')
			
			expect(() => {
				registry.add(undefined);
			}).toThrowError('Resource can\'t be undefined')
			
		});
		
		it('should throw error when metadata missing', () => {
			
			let api = new Api(undefined, undefined, undefined, undefined, undefined, undefined);
			
			spyOn(registry, 'add').and.throwError('Metadata missing for Resource class');
			
			expect(() => {
				registry.add(api);
			}).toThrowError('Metadata missing for Resource class');
			
		});
		
		it('should add resource to registry', () => {
			
			let api = new Api(undefined, undefined, undefined, undefined, undefined, undefined);
			
			Reflect.defineMetadata('ResourceName', 'Default', api);
			
			registry.add(api);
			
			expect(registry.get('Default')).toBe(api);
			
		});
		
		it('should return instance of itself', () => {
			
			let api = new Api(undefined, undefined, undefined, undefined, undefined, undefined);
			
			Reflect.defineMetadata('ResourceName', 'Default', api);
			
			expect(registry.add(api) instanceof ApiRegistry).toBeTruthy();
			
		});
		
	});
	
});
import {ResourceManager} from "./src/Manager/ResourceManager";
import {Whitelist} from "./src/Filter/Whitelist";
import {Blacklist} from "./src/Filter/Blacklist";
import {UrlGenerator} from "./src/Generator/UrlGenerator";
import {ResponseConverter} from "./src/Converter/ResponseConverter";
import {ResponseErrorConverter} from "./src/Converter/ResponseErrorConverter";
import {Configuration} from "./src/Configuration/Configuration";
import {Api} from "./src/Api/Api";
import {ResponseHandler} from "./src/Handler/ResponseHandler";
import {ApiRegistry} from "./src/Registry/ApiRegistry";
import {RequestTransform} from "./src/Transform/RequestTransform";

let global: any = window;

global.azResource = {
	ResourceManager,
	Whitelist,
	Blacklist,
	UrlGenerator,
	ResponseConverter,
	ResponseErrorConverter,
	Configuration,
	Api,
	ResponseHandler,
	ApiRegistry,
	RequestTransform
};
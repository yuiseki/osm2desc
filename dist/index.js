"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.osm2desc = void 0;
const osmtogeojson_1 = __importDefault(require("osmtogeojson"));
const turf = __importStar(require("@turf/turf"));
const getCenter = (feature) => {
    let center = undefined;
    switch (feature.geometry.type) {
        case "Polygon":
            const polygonFeatures = turf.polygon(feature.geometry.coordinates);
            center = turf.centroid(polygonFeatures);
            break;
        case "LineString":
            const bbox = turf.bbox(feature);
            const polygon = turf.bboxPolygon(bbox);
            center = turf.centroid(polygon);
            break;
        case "Point":
            center = turf.point(feature.geometry.coordinates);
        default:
            break;
    }
    return center;
};
const getArea = (feature) => {
    let area = undefined;
    switch (feature.geometry.type) {
        case "Polygon":
            const polygonFeatures = turf.polygon(feature.geometry.coordinates);
            area = turf.area(polygonFeatures);
            break;
    }
    return area;
};
const osm2desc = (osmId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    // build overpass query
    let osmIdQuery = `nwr(id:${osmId});`;
    if (osmId.startsWith("way/")) {
        osmIdQuery = `way(id:${osmId.split("/")[1]});`;
    }
    if (osmId.startsWith("node/")) {
        osmIdQuery = `node(id:${osmId.split("/")[1]});`;
    }
    if (osmId.startsWith("relation/")) {
        osmIdQuery = `relation(id:${osmId.split("/")[1]});`;
    }
    const query = `
    [out:json][timeout:30000];
    ${osmIdQuery}
    out geom;
  `;
    // request overpass api
    const res = yield fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
    });
    if (res.ok) {
        const json = yield res.json();
        const geojson = (0, osmtogeojson_1.default)(json);
        if (geojson.features.length !== 1) {
            throw Error("More than one features responded!");
        }
        const feature = geojson.features[0];
        // get center
        // TODO: generate description about center
        const center = getCenter(feature);
        let centerCoords = "";
        if (center) {
            centerCoords = [
                center.geometry.coordinates[0],
                center.geometry.coordinates[1],
            ].join(", ");
        }
        // get area
        // TODO: generate description about area
        const area = getArea(feature);
        // refine properties
        const properties = feature.properties;
        if (properties === null) {
            throw Error("Properties is null!");
        }
        delete properties.id;
        const name = properties.name;
        delete properties.name;
        let descFromProperties = `${name} that `;
        try {
            for (var _d = true, _e = __asyncValues(Object.entries(properties)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const [key, value] = _c;
                    const replacedKey = key.replace("addr:", "located ").replace(":", " ");
                    const replacedValue = value.split(";").join(", ");
                    descFromProperties += `${replacedKey} is ${replacedValue}, `;
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        descFromProperties = descFromProperties.slice(0, descFromProperties.length - 2);
        descFromProperties += ".";
        return `${descFromProperties}`;
    }
    else {
        throw Error("Overpass API response is not ok.");
    }
});
exports.osm2desc = osm2desc;

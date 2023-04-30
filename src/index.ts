import osmtogeojson from "osmtogeojson";
import * as turf from "@turf/turf";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";

const getCenter = (feature: Feature) => {
  let center: Feature<Point, GeoJsonProperties> | undefined = undefined;
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

const getArea = (feature: Feature) => {
  let area: number | undefined = undefined;
  switch (feature.geometry.type) {
    case "Polygon":
      const polygonFeatures = turf.polygon(feature.geometry.coordinates);
      area = turf.area(polygonFeatures);
      break;
  }
  return area;
};

export const osm2desc = async (osmId: string) => {
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
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (res.ok) {
    const json = await res.json();
    const geojson = osmtogeojson(json);
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
    let descFromProperties = "A place that ";
    for await (const [key, value] of Object.entries(properties)) {
      const replacedKey = key.replace("addr:", "").replace(":", " ");
      const replacedValue = value.split(";").join(", ");
      descFromProperties += `${replacedKey} is ${replacedValue}, `;
    }
    descFromProperties = descFromProperties.slice(
      0,
      descFromProperties.length - 2
    );
    descFromProperties += ".";

    return `${descFromProperties}`;
  } else {
    throw Error("Overpass API response is not ok.");
  }
};

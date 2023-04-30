# osm2desc (work in progress...)

## Usage

Command:

```bash
osm2desc way/1004357847
```

Output:

> Juba Medical Compex that located city is Juba, located street is Unity Avenue, amenity is hospital, emergency is yes, healthcare is hospital, healthcare speciality is general, paediatrics, intensive, dentistry, gynaecology, operator is Juba Medical Compex, operator type is private.

---

```bash
osm2desc way/175058726 && osm2desc way/871794846 && osm2desc way/99156121 && osm2desc way/230478092

# 全仁会上野病院 that located block_number is 23, located neighbourhood is 3丁目, located quarter is 東上野, amenity is hospital, building is hospital, building levels is 5, healthcare is hospital, area is 345.32 square metres.
# ライフ・エクステンション研究所付属永寿総合病院 that amenity is hospital, healthcare is hospital, area is 3864.27 square metres.
# Sensoji Hospital that amenity is hospital, building is hospital, building levels is 4, healthcare is hospital, area is 1577.59 square metres.
# Taito Hospital that amenity is hospital, building is hospital, area is 2380.02 square metres.
```

## Development

```
npm ci
npm run build
npm link
```

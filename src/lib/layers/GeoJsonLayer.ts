import DataSource from "./DataSource";
import { makeAutoObservable,} from "mobx";
import Color from "./Color";
import mapboxgl, {AnyLayer, AnySourceData} from "mapbox-gl";

export interface GeoJsonLayerOptions {
    fill: boolean,
    fill_color: Color
    fill_opacity: number

    stroke: boolean,
    stroke_color: Color
    stroke_width: number,
    stroke_opacity: number

    point: boolean,
    point_color: Color,
    point_opacity: number,

    line: boolean
    line_color: Color,
    line_opacity: number
}

export default class GeoJsonLayer {

    id: string;
    name: string;
    isEnabled: boolean = true;
    mapView: mapboxgl.Map;

    datasource: DataSource;
    mapboxDatasource: AnySourceData | undefined;

    options: GeoJsonLayerOptions;
    decoderUrl: string;

    constructor(id: string, name: string, datasource: DataSource, mapView: mapboxgl.Map,  options: GeoJsonLayerOptions) {

        this.decoderUrl = window.location.origin + "/decoder.bundle.js"

        this.options = options;

        makeAutoObservable(this);

        this.mapView = mapView;
        this.id = id;
        this.name = name;
        this.datasource = datasource
    }

    get mapboxFeaturesDataSource() {
        if(!this.datasource) return console.error("Datasource is not loaded properly.")
        if(!this.mapboxDatasource) {
            this.mapboxDatasource =  {
                type: "geojson",
                data: this.datasource.getData()
            }
            return this.mapboxDatasource;
        }else {
            return this.mapboxDatasource;
        }
    }

    get stroke_width(){
        return this.options.stroke_width;
    }

    set stroke_width(width: number){
        this.options.stroke_width = width;
        this.mapView.setPaintProperty(`${this.id}-stroke`, `line-width`, this.options.stroke_width);
        this.mapView.setPaintProperty(`${this.id}-line`, `line-width`, this.options.stroke_width);

    }

    set stroke_color(color: Color){
        this.options.stroke_color = color;
        this.options.stroke_opacity = color.A;
        this.mapView.setPaintProperty(`${this.id}-stroke`, `line-color`, this.options.stroke_color.hex);
        this.mapView.setPaintProperty(`${this.id}-stroke`, `line-opacity`, this.options.stroke_opacity);

        this.mapView.setPaintProperty(`${this.id}-line`, `line-color`, this.options.stroke_color.hex);
        this.mapView.setPaintProperty(`${this.id}-line`, `line-opacity`, this.options.stroke_opacity);
    }

    get stroke_color(){
        return this.options.stroke_color;
    }

    set stroke(enabled: boolean){
        this.options.stroke = enabled;
        if (!enabled) {
            this.mapView.setLayoutProperty(`${this.id}-line`, 'visibility', 'none');
            this.mapView.setLayoutProperty(`${this.id}-stroke`, 'visibility', 'none');

        } else {
            this.mapView.setLayoutProperty(
              `${this.id}-line`,
              'visibility',
              'visible'
            );

            this.mapView.setLayoutProperty(
              `${this.id}-stroke`,
              'visibility',
              'visible'
            );
        }
    }

    get stroke(){
        return this.options.stroke;
    }

    get fill(){
        return this.options.fill;
    }

    set fill(enabled: boolean){
        this.options.fill = enabled;
        if (!enabled) {
            this.mapView.setLayoutProperty(`${this.id}-fill`, 'visibility', 'none');
        } else {
            this.mapView.setLayoutProperty(
              `${this.id}-fill`,
              'visibility',
              'visible'
            );
        }

    }

    set fill_color(color: Color){
        this.options.fill_color = color;
        this.options.fill_opacity = color.A;
        this.mapView.setPaintProperty(`${this.id}-fill`, `fill-color`, this.options.fill_color.hex);
        this.mapView.setPaintProperty(`${this.id}-fill`, `fill-opacity`, this.options.fill_opacity);
    }

    get fill_color(){
        return this.options.fill_color;
    }

    //Points
    get points(){
        return this.options.point;
    }

    set points(enabled: boolean){
        this.options.point = enabled;
        if (!enabled) {
            this.mapView.setLayoutProperty(`${this.id}-circle`, 'visibility', 'none');
        } else {
            this.mapView.setLayoutProperty(
              `${this.id}-circle`,
              'visibility',
              'visible'
            );
        }
    }

    set point_color(color: Color){
        this.options.point_color = color;
        this.options.point_opacity = color.A;
        this.mapView.setPaintProperty(`${this.id}-circle`, `circle-color`, this.options.point_color.hex);
        this.mapView.setPaintProperty(`${this.id}-circle`, `circle-opacity`, this.options.point_opacity);
    }

    set line_color(color: Color){
        this.options.line_color = color;
        this.options.line_opacity = color.A;
        this.mapView.setPaintProperty(`${this.id}-line`, `line-color`, this.options.line_color.hex);
        this.mapView.setPaintProperty(`${this.id}-line`, `line-opacity`, this.options.line_opacity);
    }

    get line_color(){
        return this.options.line_color;
    }

    get point_color(){
        return this.options.point_color;
    }

    set enabled(value: boolean){
        if(this.mapboxDatasource){
            this.isEnabled = value;
            // this.mapboxDatasource.enabled = value;
            // this.mapView.update()
        }
    }

    get enabled(){
        return this.isEnabled;
    }

    get mapboxLayers(): AnyLayer[] {
        return [
            {
                'id': `${this.id}-fill`,
                'type': 'fill',
                'source': this.datasource.id,
                'paint': {
                    'fill-color': this.options.fill_color.hex,
                    'fill-opacity': this.options.fill_opacity
                },
                layout: {
                  visibility: this.options.fill ? "visible" : "none",
                },
                'filter': ['==', '$type', 'Polygon']
            },
            {
                'id': `${this.id}-stroke`,
                'type': 'line',
                'source': this.datasource.id,
                'paint': {
                    'line-color': this.options.stroke_color.hex,
                    'line-opacity': this.options.stroke_opacity,
                },
                layout: {
                    visibility: this.options.stroke ? "visible" : "none",
                },
                'filter': ['==', '$type', 'Polygon']
            },
            {
                'id': `${this.id}-circle`,
                'type': 'circle',
                'source': this.datasource.id,
                'paint': {
                    'circle-radius': 6,
                    'circle-color': this.options.point_color.hex,
                    'circle-opacity': this.options.point_opacity
                },
                layout: {
                    visibility: this.options.point ? "visible" : "none",
                },
                'filter': ['==', '$type', 'Point']
            },
            {
                'id': `${this.id}-line`,
                'type': 'line',
                'source': this.datasource.id,
                'paint': {
                    'line-color': this.options.stroke_color.hex,
                    'line-width': this.options.stroke_width,
                },
                'filter': ['==', '$type', 'LineString']
            }
        ]
    }
}
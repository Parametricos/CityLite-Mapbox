import GeoJsonLayer from "./GeoJsonLayer";
import {makeAutoObservable, reaction, toJS} from "mobx";
import DataSource from "./DataSource";
import localforage from "localforage";
import {DataSourceTypes} from "./DataSourceTypes";
import mapboxgl from "mapbox-gl";
import {App} from "../../app";

const resource_url = "https://cassini-hackathon-resources.s3.eu-central-1.amazonaws.com"
const resource_github_url = "https://raw.githubusercontent.com/Parametricos/citylite-smartcities-cassini-hackathon-2021/main/assets/layers"

const DemoData = [
    {
        name: "SF - Green Connections Network",
        description: "Green Connections aims to increase access to parks, open spaces, and the waterfront by envisioning a network of green connectors -- city streets that will be upgraded incrementally over the next 20 years to make it safer and more pleasant to travel to parks by walking, biking, and other forms of active transportation. The dataset is a zipped GIS shapefile of the Green Connections Network which is shown in this map: http://www.sf-planning.org/ftp/files/Citywide/green_connections/GC_Final_Network_Map_03-2014.pdf. Further information can be found on the Green Connections website: http://greenconnections.sfplanning.org\n",
        id: "sf_green_connections_network",
        type: "geojson",
        country: "USA",
        updated: "Sep 6, 2019",
        url: `/layers/san_francisco/green_connections_network.geojson`
    },
    {
        name: "SF - Suspected Soil/Groundwater contamination",
        description: "Development projects that are located on sites with known or suspected soil and/or groundwater contamination are subject to the provisions of Health Code Article 22A, which is administered by the Department of Public Health (DPH). ",
        id: "maher_1",
        type: "geojson",
        country: "USA",
        updated: "Nov 14, 2022",
        url: `/layers/san_francisco/Maher.geojson`
    },
    {
        name: "USA - San Francisco - Neighborhood Boundaries",
        id: "san_francisco_neighborhoods",
        type: "geojson",
        country: "USA",
        updated: "18 June 2021",
        url: `${resource_url}/layers/san_francisco_neighborhoods.json`
    },
    {
        name: "Cyprus - Limassol - Normalized Difference Vegetation Index (NDVI)",
        id: "limassol_ndvi",
        type: "geojson",
        country: "Cyprus",
        updated: "18 June 2021",
        url: `${resource_url}/layers/limassol_ndvi.geojson`
    },
    {
        name: "Cyprus - Fire - Emergency 2021.07.02",
        id: "cyprusfire_20210703",
        type: "geojson",
        country: "Cyprus",
        updated: "03 July 2021",
        url: `${resource_github_url}/20210703_CyprusFire-EPSG.geojson`
    },
    {
        name: "Cyprus - Fire - Housing 2021.07.02",
        id: "cyprusfirehousing_20210703",
        type: "geojson",
        country: "Cyprus",
        updated: "03 July 2021",
        url: `${resource_github_url}/20210703_Cadastral-Buildings-CyprusFire-EPSG.geojson`
    },
    /*{
        id: "limassol_boundary_buildings",
        name: "Limassol Boundary Buildings",
        type: "geojson",
        url: `${resource_url}/layers/limassol_boundary_buildings.geojson`
    }*/
]

export default class LayerManager {

    map: mapboxgl.Map

    dataSources: DataSource[] = []
    layers: GeoJsonLayer[] = []

    constructor(public app: App) {
        this.map = app.map;
        makeAutoObservable(this)
        this.loadCachedDataSources()
        this.loadDemoDataSources()
    }

    async addLayer(layer: GeoJsonLayer){

        this.layers.push(layer);

        if(!this.map.isSourceLoaded(layer.datasource.id)){
            const datasource = layer.mapboxFeaturesDataSource;
            if(!datasource) return console.log('datasource is not loaded properly.');
            this.map.addSource(layer.datasource.id, datasource);
        }
        for(const x of layer.mapboxLayers){
            this.map.addLayer(x)
        }
        return layer;
    }

    removeLayer(layer: GeoJsonLayer) : void {

        const datasource = layer.mapboxFeaturesDataSource;
        if(!datasource) return console.log('datasource is not loaded properly.');

        //this.map.removeDataSource(datasource);

        const index = this.layers.indexOf(layer, 0);
        if (index > -1) {
            this.layers.splice(index, 1);
        }
    }

    getDatasource (id: string) {
        return this.dataSources.find((x) => x.id === id);
    }

    async loadDemoDataSources(){
        for(let i = 0; i < DemoData.length; i++){
            try {
                const demo = DemoData[i];
                const response = await fetch(demo.url);

                const datasource = new DataSource(demo.id, demo.name, demo.type as DataSourceTypes);
                datasource.cachable = false;
                datasource.demo = true;

                await datasource.setData(await response.json())
                this.dataSources.push(datasource)
            }catch (e) {
                console.log("Error loading demo data")
                console.error(e);
            }
        }
    }


    async loadCachedDataSources(){
        localforage.iterate((value: any, key, iterationNumber) => {
            if(key.startsWith("datasource")){
                const datasource = new DataSource(value.id, value.name, value.type);
                datasource.features = value.features;
                datasource.properties = value.properties;
                datasource.data = {
                    type: "FeatureCollection",
                    features: value.features
                }
                datasource.loaded = true;
                this.dataSources.push(datasource)
            }
        }).then(function() {
            console.log('Loading cached data sources has completed');
        }).catch(function(err) {
            console.log("An error occurred loading a cached data source.")
            console.error(err);
        });
    }

    async deleteDataSource(id: string){
        const match = this.dataSources.findIndex((x) => x.id === id);
        await localforage.removeItem(`datasource-${id}`);
        this.dataSources.splice(match, 1);
    }
}
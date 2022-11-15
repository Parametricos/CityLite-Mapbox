import * as THREE from 'three';
import * as OBC from 'openbim-components'
import {Fragments} from 'openbim-components'
import mapboxgl, {LngLatLike} from 'mapbox-gl'
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {MapboxAdvancedRenderer} from "./mapbox-advanced-renderer";
import {makeAutoObservable} from "mobx";
import LayerManager from "./lib/layers/LayerManager";

export class App {

  map: mapboxgl.Map;
  components: OBC.Components;
  renderer: MapboxAdvancedRenderer;
  fragments?: Fragments;
  layer_manager: LayerManager;

  tab: number = 0;
  dataSourcesOpen: boolean = false;

  private _coordinates: LngLatLike = {
    lng:   -122.4116363927742,
    lat: 37.80253164862188,
  }

  constructor(container: HTMLDivElement) {
    makeAutoObservable(this);
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWd2aWVnYXMiLCJhIjoiY2wyZjE4emwwMDYzbTNlb2dyODFyZHd2ciJ9.4939d5SFkJYnw9BpMxlPnA';
    const height = 0;
    const merc = mapboxgl.MercatorCoordinate;
    const coords = merc.fromLngLat(this.coordinates, height);

    const map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 18,
      center: this.coordinates,
      pitch: 60,
      antialias: true,
    });

    this.map = map;

    // Create basic components

    const components = new OBC.Components();
    components.scene = new OBC.SimpleScene(components);
    components.camera = new OBC.MapboxCamera();
    components.renderer = new MapboxAdvancedRenderer(components, map, coords);
    components.init();
    this.components = components;
    this.renderer = components.renderer as MapboxAdvancedRenderer;

    // Three.js' scene is rendered on top of mapbox's scene, so the background of the latter needs to be transparent

    const scene = components.scene.get();
    scene.background = null;

    // Create two three.js lights to illuminate the model

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);

    // Create a simple cube in the center of the scene

    // const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    // const redMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
    // const redCube = new THREE.Mesh(cubeGeometry, redMaterial);
    // redCube.position.set(0, 5, 0);
    // scene.add(redCube);

    // Add a label

    const htmlLabel = document.createElement('div');
    const htmlIcon = document.createElement('p');
    htmlIcon.textContent = '🚀';
    htmlLabel.append(htmlIcon);
    htmlLabel.classList.add('example-label');

    const label = new CSS2DObject(htmlLabel);
    label.position.y = 10;
    scene.add(label);

    this.layer_manager = new LayerManager(this)

    this.renderer.initialized.on(() => {
      // Setup fragment
      this.fragments = new Fragments(components)
      this.fragments.ifcLoader.settings.setWasmPath('../../../../')
    })
  }

  set coordinates(value: LngLatLike){

    const height = 0;
    const merc = mapboxgl.MercatorCoordinate;
    const coords = merc.fromLngLat(this.coordinates, height);

    this._coordinates = value;
    this.map.setCenter(value);
    this.renderer.updateCoordinates(coords);
  }

  get coordinates(){
    return this._coordinates;
  }

  async loadIfc(url: URL){
    if(!this.fragments) return;
    const group = await this.fragments.ifcLoader.load(url)
  }

  async loadIfcFromFile(file: File){

    const reader = new FileReader();
    reader.onloadend = async () => {
      if(!this.fragments) return;
      this.fragments.ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
      const group = await this.fragments.ifcLoader.load(new URL(reader.result as string))
      this.components.scene.get().add(group)
    };
    reader.readAsDataURL(file);
  }
}
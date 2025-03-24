require([
    "esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery",
    "esri/widgets/Locate", "esri/widgets/ScaleBar", 
    "esri/widgets/Legend", "esri/widgets/Measurement",
    "esri/widgets/Search","esri/widgets/LayerList"
], function(esriConfig, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, Locate, ScaleBar, Legend, Measurement, Search, LayerList) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQo8yGd7pFIe4pcOHlbwR69SinQqy9zTzkZdSz2VTGZ6ECmPcEZ8kcd--Z0_iqF07Rew7TPEdCBEjlP8dMjtQmhSIoMIjiBB_B4wm3cnHnbRlsUluPBOzzA4tsB5fSr7eKATJzbxATPhzkLZLFr1iLD0enWlFYydL-GEQzmLk6uDmp-ANuwxMaMeXG15GF1qUIAT1_HNOoAM8o";

    const map = new Map({
        basemap: "arcgis-topographic" // Fond de carte initial
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59], // Longitude, latitude
        zoom: 13, // Niveau de zoom
        container: "viewDiv"
    });

     // 📌 Ajout des couches SIG
     const communesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/5",
        title: "Limites des Communes"
    });

    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/4",
        title: "Voirie"
    });

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/0",
        title: "Population"
    });

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/2",
        title: "Hôtels"
    });

    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/1",
        title: "Grandes Surfaces"
    });

    

    map.addMany([communesLayer, voirieLayer, populationLayer, 
                 hotelsLayer, grandesSurfacesLayer]);

    // Basemap Toggle (bascule entre 2 fonds de carte)
    let basemapToggle = new BasemapToggle({
        view: view,  
        nextBasemap: "hybrid"
    });
    view.ui.add(basemapToggle, {
        position: "bottom-right",
        index: 2
    });

    // Basemap Gallery (liste de fonds de carte)
    let basemapGallery = new BasemapGallery({
        view: view
    });
    view.ui.add(basemapGallery, {
        position: "bottom-left",
        index: 3
    });
});
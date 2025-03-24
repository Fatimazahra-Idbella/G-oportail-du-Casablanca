require([
    "esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery",
    "esri/widgets/Locate", "esri/widgets/ScaleBar", 
    "esri/widgets/Legend", "esri/widgets/Measurement",
    "esri/widgets/Search","esri/widgets/LayerList"
], function(esriConfig, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, Locate, ScaleBar, Legend, Measurement, Search, LayerList) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJqJHuAOWtOeDglllaI2VkGQJcsxVB5nwix6mkxlBH9hZ-AjnV_E71vEK23PSBKxb0vqgeVYKzwB9ZZxXHc5AI3T5Fkxeoj6pehBtt5Cl9Sy4HanCmXsGji5WoKczKyfznal2gcg_5E7nXLUk7rinUNslNDwpjsrPaH_6fcEnf5PrCSoutI49AX_50Bo1xATTQ4DI330jPPj7s9yTLhtghPTd1o750K3mFbhn8YFGxaBAT1_5EgyghtX";

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
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/commune_casa1/FeatureServer",
        title: "Limites des Communes"
    });

    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/voirie/FeatureServer",
        title: "Voirie"
    });

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casapop1/FeatureServer",
        title: "Population"
    });

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/hotels/FeatureServer",
        title: "Hôtels"
    });

    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/grands_surface/FeatureServer",
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
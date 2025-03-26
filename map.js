require([
    "esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery",
    "esri/widgets/Locate", "esri/widgets/ScaleBar", 
    "esri/widgets/Legend", "esri/widgets/Measurement",
    "esri/widgets/Search","esri/widgets/LayerList",
    "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch",
  "esri/widgets/Editor",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/PieChartRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color"

], function(esriConfig, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, Locate, ScaleBar, Legend, Measurement, Search, LayerList, GraphicsLayer, Sketch, Editor, ClassBreaksRenderer, PieChartRenderer, SimpleFillSymbol, Color) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQo8yGd7pFIe4pcOHlbwR69SinQqy9zTzkZdSz2VTGZ6ECmPcEZ8kcd--Z0_iqF07Rew7TPEdCBEjlP8dMjtQmhSIoMIjiBB_B4wm3cnHnbRlsUluPBOzzA4tsB5fSr7eKATJzbxATPhzkLZLFr1iLD0enWlFYydL-GEQzmLk6uDmp-ANuwxMaMeXG15GF1qUIAT1_HNOoAM8o";

    const map = new Map({
        basemap: "arcgis-topographic"
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59],
        zoom: 10,
        container: "viewDiv"
    });

    // Définition de la couche des communes
    const communesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/5",
        title: "Limites des Communes",
        outFields: ["*"],
        popupTemplate: {
            title: "{COMMUNE_AR}",
            content: "Préfecture : {PREFECTURE} <br> Surface : {SURFACE} km²"
        }
    });

    map.add(communesLayer);
    



    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/4",
        title: "Voirie"
    });

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/0",
        title: "Population",
        outFields: ["*"],
        popupTemplate: {
            title: "{PREFECTURE}",
            content: "1994 : {TOTAL1994} <br> 2004 : {TOTAL2004}"
        }
    });

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/2",
        title: "Hôtels",
        outFields: ["*"],
        popupTemplate: {
            title: "{HOTEL}",
            content: "Catégorie : {CATÉGORIE} "
        }
    });

    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/1",
        title: "Grandes Surfaces",
        outFields: ["*"],
        popupTemplate: {
            title: "{Adresse}",
            content: "Type : {Type}"
        }
    });


    const reclamationsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/reclamations/FeatureServer",
        title: "Réclamations",
        outFields: ["*"],
        popupTemplate: {
            title: "{Objet}",
            content: "Message : {Message} <br> Contact : {Mail}"
        }
    });

    

    map.addMany([ voirieLayer, populationLayer, 
                 hotelsLayer, grandesSurfacesLayer, reclamationsLayer]);

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
    /*let basemapGallery = new BasemapGallery({
        view: view
    });
    view.ui.add(basemapGallery, {
        position: "bottom-left",
        index: 3
    });*/


    // Création du bouton pour la BasemapGallery
    const basemapButton = document.createElement("button");
    basemapButton.id = "basemapButton";
    basemapButton.innerText = "Choisir un fond de carte";
    document.body.appendChild(basemapButton);

    // Initialisation de la BasemapGallery (non ajoutée directement à l'UI)
    let basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div") // Conteneur temporaire
    });

    let isGalleryVisible = false;

    // Gestion du clic sur le bouton
    basemapButton.addEventListener("click", function() {
        if (!isGalleryVisible) {
            // Ajouter la galerie à l'UI en bas à gauche
            view.ui.add(basemapGallery, {
                position: "bottom-left",
                index: 3
            });
            basemapGallery.container.classList.add("visible"); // Afficher
            isGalleryVisible = true;
            basemapButton.innerText = "Masquer les fonds de carte";
        } else {
            // Masquer la galerie
            view.ui.remove(basemapGallery);
            basemapGallery.container.classList.remove("visible");
            isGalleryVisible = false;
            basemapButton.innerText = "Choisir un fond de carte";
        }
    });

    // Clic hors de la galerie pour la masquer
    document.addEventListener("click", function(event) {
        if (isGalleryVisible && !basemapButton.contains(event.target) && !basemapGallery.container.contains(event.target)) {
            view.ui.remove(basemapGallery);
            basemapGallery.container.classList.remove("visible");
            isGalleryVisible = false;
            basemapButton.innerText = "Choisir un fond de carte";
        }
    });

    
   
    // Outil de localisation
    let locateWidget = new Locate({
        view: view
    });
    view.ui.add(locateWidget, "top-left");

    // Barre d'échelle
    let scaleBar = new ScaleBar({
        view: view
    });
    view.ui.add(scaleBar, "bottom-left");

    // Widget de mesure
    let measurementWidget = new Measurement({
        view: view
    });
    view.ui.add(measurementWidget, "top-right");

    // Légende
    /*let legend = new Legend({
        view: view
    });
    view.ui.add(legend, "bottom-right");*/


    // Création du bouton pour la Legend
    const legendButton = document.createElement("button");
    legendButton.id = "legendButton";
    legendButton.innerText = "Afficher la légende";
    document.body.appendChild(legendButton);

    // Initialisation de la Legend (non ajoutée directement à l'UI)
    let legend = new Legend({
        view: view,
        container: document.createElement("div") // Conteneur temporaire
    });

    let isLegendVisible = false;

    // Gestion du clic sur le bouton
    legendButton.addEventListener("click", function() {
        if (!isLegendVisible) {
            // Ajouter la légende à l'UI en bas à droite
            view.ui.add(legend, {
                position: "bottom-right"
            });
            legend.container.classList.add("visible"); // Afficher
            isLegendVisible = true;
            legendButton.innerText = "Masquer la légende";
        } else {
            // Masquer la légende
            view.ui.remove(legend);
            legend.container.classList.remove("visible");
            isLegendVisible = false;
            legendButton.innerText = "Afficher la légende";
        }
    });

    // Clic hors de la légende pour la masquer
    document.addEventListener("click", function(event) {
        if (isLegendVisible && !legendButton.contains(event.target) && !legend.container.contains(event.target)) {
            view.ui.remove(legend);
            legend.container.classList.remove("visible");
            isLegendVisible = false;
            legendButton.innerText = "Afficher la légende";
        }
    });

    // Widget de recherche
    let searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, "top-right");


    


  

    // Liste des couches
    /*let layerList = new LayerList({
        view: view
    });
    view.ui.add(layerList, "top-right");*/


    // Création du bouton pour la LayerList
    const layerListButton = document.createElement("button");
    layerListButton.id = "layerListButton";
    layerListButton.innerText = "Liste des couches";
    document.body.appendChild(layerListButton);

    // Initialisation de la LayerList (non ajoutée directement à l'UI)
    let layerList = new LayerList({
        view: view,
        container: document.createElement("div") // Conteneur temporaire
    });

    let isLayerListVisible = false;

    // Gestion du clic sur le bouton
    layerListButton.addEventListener("click", function() {
        if (!isLayerListVisible) {
            // Ajouter la liste des couches à l'UI en haut à droite
            view.ui.add(layerList, {
                position: "top-right"
            });
            layerList.container.classList.add("visible"); // Afficher
            isLayerListVisible = true;
            layerListButton.innerText = "Masquer la liste";
        } else {
            // Masquer la liste
            view.ui.remove(layerList);
            layerList.container.classList.remove("visible");
            isLayerListVisible = false;
            layerListButton.innerText = "Liste des couches";
        }
    });

    // Clic hors de la liste pour la masquer
    document.addEventListener("click", function(event) {
        if (isLayerListVisible && !layerListButton.contains(event.target) && !layerList.container.contains(event.target)) {
            view.ui.remove(layerList);
            layerList.container.classList.remove("visible");
            isLayerListVisible = false;
            layerListButton.innerText = "Liste des couches";
        }
    });

    // Fonction pour interroger la couche des communes
    function queryFeatureLayer(geometry) {
        const communeQuery = communesLayer.createQuery();
        communeQuery.spatialRelationship = "intersects";
        communeQuery.geometry = geometry;
        communeQuery.outFields = ["PREFECTURE", "COMMUNE_AR", "Shape_Area"];
        communeQuery.returnGeometry = true;

        communesLayer.queryFeatures(communeQuery)
            .then((results) => {
                console.log("Nombre de communes trouvées :", results.features.length);
            })
            .catch((error) => {
                console.error("Erreur lors de la requête :", error);
            });
    }

    
    // Filtrage des communes par préfecture, commune ou surface
    document.getElementById("filterSelect").addEventListener("change", function (event) {
        let selectedFilter = event.target.value;
        console.log("Filtre sélectionné :", selectedFilter);

        if (selectedFilter) {
            if (communesLayer) {
                communesLayer.definitionExpression = selectedFilter; // Appliquer le filtre SQL
                console.log("Expression appliquée :", communesLayer.definitionExpression);
            } else {
                console.error("La couche 'communesLayer' n'est pas encore chargée.");
            }
        } else {
            communesLayer.definitionExpression = ""; // Réinitialiser
            console.log("Filtre réinitialisé");
        }
    });

    // Ajouter un événement au clic pour interroger la couche
view.on("click", function(event) {
    queryFeatureLayer(event.mapPoint);
});
 



    // Filtrage des hôtels par catégorie
    document.getElementById("hotelFilter").addEventListener("change", function (event) {
        let selectedCategory = event.target.value;
        hotelsLayer.definitionExpression = selectedCategory ? `CATÉGORIE = '${selectedCategory}'` : "";
    });

    // Filtrage des grandes surfaces par type
    document.getElementById("surfaceFilter").addEventListener("change", function (event) {
        let selectedType = event.target.value;
        grandesSurfacesLayer.definitionExpression = selectedType ? `Type = '${selectedType}'` : "";
    });

    // Recherche et affichage des résultats
    view.on("click", function(event) {
        queryLayer(event.mapPoint, hotelsLayer);
        queryLayer(event.mapPoint, grandesSurfacesLayer);
    });

    function queryLayer(geometry, layer) {
        const query = layer.createQuery();
        query.geometry = geometry;
        query.spatialRelationship = "intersects";
        query.returnGeometry = true;
        query.outFields = ["*"];

        layer.queryFeatures(query).then((results) => {
            if (results.features.length > 0) {
                view.popup.open({
                    location: geometry,
                    features: results.features
                });
            }
        });
    }


         // Configuration de l'outil d'édition Editor
         const editor = new Editor({
            view: view,
            layerInfos: [{
                layer: reclamationsLayer,
                formTemplate: {
                    elements: [
                        {
                            type: "field",
                            fieldName: "objet",
                            label: "Objet"
                        },
                        {
                            type: "field",
                            fieldName: "Message",
                            label: "Message"
                        },
                        {
                            type: "field",
                            fieldName: "Mail",
                            label: "Email de contact"
                        }
                    ]
                }
            }],
            enabled: true,
            addEnabled: true,
            updateEnabled: true,
            deleteEnabled: false,
            attributeUpdatesEnabled: true,
            geometryUpdatesEnabled: true
        });

        // Ajout de l'outil Editor à l'interface
        view.ui.add(editor, "top-left");

        // Fonction pour récupérer et afficher les réclamations
        function loadReclamations() {
            reclamationsLayer.queryFeatures({
                where: "1=1",
                outFields: ["Message", "objet", "Mail"],
                returnGeometry: false
            }).then(function(response) {
                const features = response.features;
                const tableBody = document.getElementById("reclamationsTable");
                tableBody.innerHTML = ""; // Vider la table avant de recharger

                features.forEach(function(feature) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${feature.attributes.objet}</td>
                        <td>${feature.attributes.Message}</td>
                        <td>${feature.attributes.Mail}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }).catch(function(error) {
                console.error("Erreur lors du chargement des réclamations :", error);
            });
        }

        // Charger les réclamations au démarrage
        view.when(loadReclamations);

        // Rafraîchir la liste après l'ajout d'une réclamation
        reclamationsLayer.on("apply-edits", function() {
            loadReclamations();
        });

// Définition des filtres SQL
/*const sqlExpressions = [
    "------ Choisir un filtre -----",
    "--- Population 2004 ---",
    "TOTAL2004 <= 50000",
    "TOTAL2004 > 50000 AND TOTAL2004 <= 100000",
    "TOTAL2004 > 100000 AND TOTAL2004 <= 200000",
    "TOTAL2004 > 200000 AND TOTAL2004 <= 500000",
    "TOTAL2004 > 500000",
    "--- Population 1994 ---",
    "TOTAL1994 <= 50000",
    "TOTAL1994 > 50000 AND TOTAL1994 <= 100000",
    "TOTAL1994 > 100000 AND TOTAL1994 <= 200000",
    "TOTAL1994 > 200000 AND TOTAL1994 <= 500000",
    "TOTAL1994 > 500000",
    "--- Évolution 1994-2004 ---",
    "evolution_ > 0 AND evolution_ <= 10000",
    "evolution_ > 10000 AND evolution_ <= 50000",
    "evolution_ > 50000 AND evolution_ <= 100000",
    "evolution_ > 100000"
];

// Création du menu déroulant pour les filtres
const selectFilter = document.createElement("select");
selectFilter.style.padding = "5px";
selectFilter.style.fontSize = "14px";
selectFilter.id = "filterSelect";

sqlExpressions.forEach(function (sql) {
    let option = document.createElement("option");
    option.value = sql.includes("---") ? "" : sql;
    option.innerHTML = sql;
    if (sql.includes("---")) {
        option.disabled = true;
        option.style.fontWeight = "bold";
    }
    selectFilter.appendChild(option);
});

view.ui.add(selectFilter, "top-right");

// Fonction pour appliquer les filtres
function setFeatureLayerFilter(expression) {
    
    populationLayer.definitionExpression = expression || "";
}

// Écouteur pour appliquer le filtre
selectFilter.addEventListener("change", function (event) {
    setFeatureLayerFilter(event.target.value);
});
*/
// Renderers pour la population
const pop2004Renderer = new ClassBreaksRenderer({
    field: "TOTAL2004",
    classBreakInfos: [
        { minValue: 0, maxValue: 50000, symbol: new SimpleFillSymbol({ color: new Color([255, 245, 235, 0.7]) }), label: "0 - 50,000" },
        { minValue: 50001, maxValue: 100000, symbol: new SimpleFillSymbol({ color: new Color([255, 215, 180, 0.7]) }), label: "50,001 - 100,000" },
        { minValue: 100001, maxValue: 200000, symbol: new SimpleFillSymbol({ color: new Color([255, 175, 120, 0.7]) }), label: "100,001 - 200,000" },
        { minValue: 200001, maxValue: 500000, symbol: new SimpleFillSymbol({ color: new Color([255, 135, 60, 0.7]) }), label: "200,001 - 500,000" },
        { minValue: 500001, maxValue: 1000000, symbol: new SimpleFillSymbol({ color: new Color([255, 95, 0, 0.7]) }), label: "> 500,000" }
    ]
});

const pop1994Renderer = new ClassBreaksRenderer({
    field: "TOTAL1994",
    classBreakInfos: [
        { minValue: 0, maxValue: 50000, symbol: new SimpleFillSymbol({ color: new Color([235, 245, 255, 0.7]) }), label: "0 - 50,000" },
        { minValue: 50001, maxValue: 100000, symbol: new SimpleFillSymbol({ color: new Color([180, 215, 255, 0.7]) }), label: "50,001 - 100,000" },
        { minValue: 100001, maxValue: 200000, symbol: new SimpleFillSymbol({ color: new Color([120, 175, 255, 0.7]) }), label: "100,001 - 200,000" },
        { minValue: 200001, maxValue: 500000, symbol: new SimpleFillSymbol({ color: new Color([60, 135, 255, 0.7]) }), label: "200,001 - 500,000" },
        { minValue: 500001, maxValue: 1000000, symbol: new SimpleFillSymbol({ color: new Color([0, 95, 255, 0.7]) }), label: "> 500,000" }
    ]
});

const pieChartRenderer = new PieChartRenderer({
    attributes: [
        { field: "TOTAL1994", label: "Population 1994", color: new Color([0, 120, 255, 0.8]) },
        { field: "TOTAL2004", label: "Population 2004", color: new Color([255, 120, 0, 0.8]) }
    ],
    holePercentage: 0.2,
    size: 20
});

// Création d'un sélecteur pour la visualisation de la population
/*const populationSelect = document.createElement("select");
populationSelect.id = "populationFilter";
populationSelect.style.padding = "5px";
populationSelect.style.fontSize = "14px";
populationSelect.innerHTML = `
    <option value="default">Affichage par défaut</option>
    <option value="pop2004">Population 2004 (5 classes)</option>
    <option value="pop1994">Population 1994 (5 classes)</option>
    <option value="pieChart">Comparaison 1994/2004 (diagrammes)</option>
`;
view.ui.add(populationSelect, "top-right");

// Écouteur pour le sélecteur de population
populationSelect.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    switch (selectedValue) {
        case "pop2004":
            populationLayer.renderer = pop2004Renderer;
            populationLayer.definitionExpression = ""; // Réinitialiser le filtre pour voir toutes les données
            break;
        case "pop1994":
            populationLayer.renderer = pop1994Renderer;
            populationLayer.definitionExpression = "";
            break;
        case "pieChart":
            populationLayer.renderer = pieChartRenderer;
            populationLayer.definitionExpression = "";
            break;
        default:
            populationLayer.renderer = null;
            break;
    }
    console.log("Renderer appliqué :", selectedValue);
});*/





// Gestion des filtres pour les communes
document.getElementById("filterSelect").addEventListener("change", function(event) {
    communesLayer.definitionExpression = event.target.value || "";
});


// Gestion des filtres SQL pour la population
document.getElementById("populationSqlFilter").addEventListener("change", function(event) {
    populationLayer.definitionExpression = event.target.value || "";
});


// Gestion du sélecteur pour la visualisation PieChart
document.getElementById("populationPieChartFilter").addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "pieChart") {
        populationLayer.renderer = pieChartRenderer;
        populationLayer.definitionExpression = ""; // Réinitialiser le filtre pour voir toutes les données
    } else {
        populationLayer.renderer = null; // Retour à l'affichage par défaut
    }
    console.log("Renderer appliqué :", selectedValue);
});
// Bouton et menu
const filterMenuButton = document.getElementById("filterMenuButton");
const filtersMenu = document.getElementById("filtersMenu");
let isMenuVisible = false;

filterMenuButton.addEventListener("click", function(event) {
    event.stopPropagation();
    if (!isMenuVisible) {
        filtersMenu.classList.remove("hidden");
        filterMenuButton.innerText = "Masquer les filtres";
        isMenuVisible = true;
    } else {
        filtersMenu.classList.add("hidden");
        filterMenuButton.innerText = "Filtres";
        isMenuVisible = false;
    }
});

document.addEventListener("click", function(event) {
    if (isMenuVisible && !filtersMenu.contains(event.target) && !filterMenuButton.contains(event.target)) {
        filtersMenu.classList.add("hidden");
        filterMenuButton.innerText = "Filtres";
        isMenuVisible = false;
    }
});

});

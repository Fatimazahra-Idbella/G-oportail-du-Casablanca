# 🗺️ Géoportail du Grand Casablanca

Ce projet consiste à développer un **Géoportail interactif** basé sur **ArcGIS Maps SDK for JavaScript** permettant de visualiser, interroger et éditer des données géographiques relatives à la région du **Grand Casablanca**.

## 🌐 Fonctionnalités principales

### I. 📌 Carte interactive
- Affichage d'une carte centrée sur la région du Grand Casablanca.
- Couches cartographiques intégrées :
  - Limites des communes
  - Voirie
  - Population
  - Hôtels
  - Grandes surfaces
  - Centres de formation supérieurs
  - Fonds de carte multiples (satellite, topographique, rues, etc.)

- Outils de navigation :
  - Zoom avant/arrière
  - Pan
  - Mesure de distances et surfaces

- Widgets intégrés :
  - Changement de fond de carte
  - Légende interactive
  - Barre de recherche géographique
  - Fenêtres contextuelles (popups) sur chaque couche

### II. 🎨 Symbologie dynamique
- **Couches Communes** :
  - Par préfecture
  - Par commune/arrondissement
  - Par classes de surface (5 classes)

- **Couches Population** :
  - Population en 1994 (5 classes)
  - Population en 2004 (5 classes)
  - Comparaison 1994/2004 sous forme de diagrammes

### III. 🔍 Requêtes et Filtres
- Recherche des **hôtels par catégorie** (1*, 2*, 3*, ...)
- Recherche des **grandes surfaces par type** (Marjane, Acima, ...)
- Affichage des résultats avec fenêtres contextuelles personnalisées

### IV. 📝 Édition des données - Gestion des réclamations
- Ajout d'une **couche Réclamations**
- Outil d’édition :
  - L’utilisateur peut cliquer sur la carte pour **signaler une réclamation**
  - Formulaire intégré avec :
    - Objet de la réclamation
    - Message
    - Adresse email
- Affichage de la **liste des réclamations enregistrées**

---

## 🛠️ Technologies utilisées

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- HTML / CSS / JavaScript
- ArcGIS Online ou ArcGIS Enterprise (selon le cas)
- (Optionnel) Framework UI : Bootstrap ou Tailwind CSS

---

## 🚀 Installation et exécution

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/votre-utilisateur/geoportail-casablanca.git
   cd geoportail-casablanca

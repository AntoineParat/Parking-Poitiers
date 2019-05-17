
const endPoint =
  "https://data.grandpoitiers.fr/api/records/1.0/search/?dataset=mobilites-stationnement-des-parkings-en-temps-reel&facet=nom";
const data = [];
const distanceArray= [];
const parkingCoordinates = [];
const currentParking = [];
const name = document.querySelector("#parking_name");
const freeSations = document.querySelector("#free_stations");
const txRempl = document.querySelector("#tx_rempl");
const mAj = document.querySelector('#maj');

/*------------- CREATING THE MAP ---------*/

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW50b2luZXBhcmF0IiwiYSI6ImNqdXZnOG9hOTAxOWozeXFiZHQzaTVxMm0ifQ.G80c_FyQenvcgMSStI2kKg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [0.339, 46.581], // starting position
  zoom: 14 // starting zoom
});

var canvas = map.getCanvasContainer();

/*------------- GEOCODER ---------
// adding search box 
map.addControl(new MapboxGeocoder({
   accessToken: mapboxgl.accessToken,
   mapboxgl: mapboxgl
   }));
*/

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
});

// Inserting geocoder outside map
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

/*------------- NAVIGATION CONTROLS ---------*/

map.addControl(new mapboxgl.NavigationControl());

/*------------- GET PARKINGS' COORDINATES AND SET MARKERS TO THE MAP ---------*/

fetch(endPoint)
  .then(response => response.json())
  .then(dataset => {
    for (let e of dataset.records) {
      parkingCoordinates.push({
        nom: e.fields.nom,
        lat: e.geometry.coordinates[0],
        lng: e.geometry.coordinates[1],
        distance : '',
        id : dataset.records.indexOf(e)
      });
    }
  })
  .then(() => {
    for (let e of parkingCoordinates) {  
      var marker = new mapboxgl.Marker().setLngLat([e.lat, e.lng]).addTo(map);
      marker._element.id = e.id;
      marker._element.style.cursor = "pointer";
    }
  })
  .catch(err => {
     console.log(err)
     alert('Impossible de charger les données pour le moment.')
});

/*------------- GET PARKING'S INFO ON CLICK ---------*/

function getFreePlaces() {
  fetch(endPoint)
    .then(response => response.json())
    .then(dataset => {
      const data = dataset 
      fillFields(data)
        getTime()
    })
    .catch(err => {
       console.log(err);
       alert('Impossible de charger les données pour le moment.')
    })
}

/*------------- GET TIME ---------*/

function getTime () {
  const date = new Date();
  let second = date.getSeconds();
  second >= 10 ? "" : second = "0" + second;
  let minute = date.getMinutes();
  minute >= 10 ? "" : minute = "0" + minute;
  let heure = date.getHours();
  heure >= 10 ? "" : heure = "0" + heure;
  const time = `${heure}:${minute}:${second} `;
  mAj.textContent = time;
}

/*------------- INFO FIELDS' TEXT CONTENT  ---------*/

function fillFields(dataset) {
  freeSations.textContent =
    dataset.records[currentParking[0]].fields.places_restantes;
  txRempl.textContent =
    dataset.records[currentParking[0]].fields.taux_doccupation.toFixed(1) + " %";
  name.textContent = 
    dataset.records[currentParking[0]].fields.nom;
}

/*------------- FIND & DISPLAY CLOSEST PARKING---------*/

let start = "";

function getLocation (callback) {
  if (start === "") { 
    navigator.geolocation.getCurrentPosition(function(position) {
      start = [position.coords.longitude, position.coords.latitude]
      callback();
    });
  }
  else (callback())
}

function findNearestMarker () {  
  for (let e of parkingCoordinates) {
    if ( e.distance != '') {
      e.distance = '';
    }
    const from = turf.point([start[0], start[1]]);
    const to = turf.point([e.lat, e.lng]);
    const options = {units: 'kilometers'};
    const distance = turf.distance(from, to, options);
    e.distance = distance;
  }
  displayPark();
};

function displayPark () {
  let map1 = parkingCoordinates.map(e => e);// a copy of our main array 
  map1.sort((a, b) => a.distance - b.distance);// is sorting
  currentPark(map1[0].id)//the first item is pushing to currentParking
  fetch(endPoint)
    .then(response => response.json())
    .then(dataset => { 
      const data = dataset 
      fillFields(data)
      getTime()
      map.flyTo({
        center: [parkingCoordinates[currentParking[0]].lat, parkingCoordinates[currentParking[0]].lng],
        zoom: 15,
        bearing: 0,
        speed: 0.6, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        easing: function (t) { return t; }
      });
    })
    .then(function () {
      addStartingPoint ('position')
    })
    .catch(err => {
       console.log(err);
       alert('Impossible de charger les données pour le moment.')
    })
}

/*------------- STORING ID OF THE DISPLAYED PARKING ---------*/

// Parking actually clicked is stored here
//Thus we can easily find it when clicking on "itineraire"
function currentPark (e) {
  currentParking.shift();
  currentParking.push(e); 
  console.log(currentParking) 
}

/*------------- ROUTING---------*/

// routing.js

/*------------- EVENT LISTENER ---------*/

document.addEventListener("click", function(e) {
  if (e.target.parentNode.parentNode.parentNode.parentNode.className === 
    "mapboxgl-marker mapboxgl-marker-anchor-center") {
    currentPark(e.target.parentNode.parentNode.parentNode.parentNode.id) 
    getFreePlaces();
    info.scrollIntoView();
    }
});

document.querySelector("#itineraire").addEventListener("click", function() {
  if (countID === 0) { 
  getLocation(route);// This function has to be executed only once : to set starting point
  }
  else (displayRoute())
});

document.addEventListener('click', function (e) {
  if (e.target.id != "itineraire") {
    instructions.style.display = "none";
    info.style.display ="block";
  }
})

/*------------- MARKERS & POPUP ---------*/

/*
var popup = new mapboxgl.Popup({closeOnClick: false, closeButton : false})
.setText('Construction on the Washington Monument began in 1848.')

   var marker = new mapboxgl.Marker()
   .setLngLat([0.33500, 46.58100])
   //.setPopup(popup)
   .addTo(map)
   marker._element.id = "tste" 
*/

/*
var popup = new mapboxgl.Popup({closeOnClick: false, closeButton : false})
  .setLngLat([0.33500, 46.58180])
  .setText('')
  .addTo(map);
  popup._content.id = "test";
  popup._content.innerHTML = "testlksqdkqlskdjqlskdj"; 
  */

/*------------- ROUTING---------*/
const info = document.querySelector('#info');
const instructions = document.querySelector('#instructions');
// create a function to make a directions request
function getRoute(end) {
  // make a directions request using cycling profile
  // start will always be the same
  // only the end or destination will change
    start 
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
    var data = req.response.routes[0];
    var route = data.geometry.coordinates;
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    } else { // otherwise, make a new request
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geojson
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#CC3D43', //'#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
    // get the sidebar and add the instructions
//var instructions = document.getElementById('instructions');
var steps = data.legs[0].steps;

var tripInstructions = [];
for (var i = 0; i < steps.length; i++) {
  tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
  instructions.innerHTML = `<button type="button" class="close" aria-label="Close">
  <span id="close" aria-hidden="true">&times;</span> </button>` +
  '<br><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) +' min </span>' + 
  `<br><span>Please, be aware that the line's accuracy decreases with distance. </span><br>` +
  tripInstructions;
}
   
  };
  req.send();
}

let countID = 0;

function go () {
  countID += 1;// This function has to be executed only once : to set starting point
  return new Promise(resolve => { 
  // make an initial directions request that
  // starts and ends at the same location
  getRoute(start);
  // Add starting point to the map
  addStartingPoint ('point');
  resolve();
  });
}

/*------------- DRAW STRATING POINT TO THE MAP---------*/

function addStartingPoint (id) {
  map.addLayer({
    id: id,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: start
          }
        }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#CC3D43'
    },
  });
}

async function route () {
  await go ()
  .then(function() {
    getRoute([parkingCoordinates[currentParking[0]].lat, parkingCoordinates[currentParking[0]].lng]);
    instructions.style.display = "block";
    info.style.display ="none";
    getRoute([parkingCoordinates[currentParking[0]].lat, parkingCoordinates[currentParking[0]].lng]);
  })
}

function displayRoute () {
    instructions.style.display = "block";
    info.style.display ="none";
    getRoute([parkingCoordinates[currentParking[0]].lat, parkingCoordinates[currentParking[0]].lng]);
  }
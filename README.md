# Real time parking in Poitiers

![enter image description here](https://www.antoineparat.com/img/parking.png)

This website displays real-time data about parking in Poitiers.

# Features

## Open Data

I'm using [Open Data Poitiers](https://data.grandpoitiers.fr/pages/accueil/) API to fetch real-time infos.

## Mapbox routing API

At first [Mapbox](https://www.mapbox.com/) is used to provide the map.
Then i used the Mapbox routing APi to calculate and to draw a route, from the user's current position to the selected parking.


## Turf.js

[Turf.js](https://turfjs.org/) is a geospatial engine which allowed me to calculate the distance between the user's current position and each parking. Then, it's easy to know wich parking is the closest of the user and add this feature to the website. 

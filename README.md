# Real time parking in POitiers
---

This project displays real-time data about parking in Poitiers.

## Fetch API

I'm using fetch API to get data through the Poitiers' openData API. 

## mapBox routing API

At first MapBox is used to provide the map.
Then i used the mapBox routing APi to calculate and to draw a route, from the user's current position to the selected parking.


### Turf.js

Turf.js is a geospatial engine which allowed me to calculate the distance between the user's current position and each parking. Then, it's easy to know wich parking is the closest of the user and add this feature to the website. 






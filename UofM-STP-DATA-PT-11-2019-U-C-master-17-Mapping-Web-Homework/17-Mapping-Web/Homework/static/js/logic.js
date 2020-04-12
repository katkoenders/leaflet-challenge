// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var API_KEY = "pk.eyJ1Ijoia29lbmRlcnMwNzE0IiwiYSI6ImNrOGY0Y296ZDAwaDIzZm9pdWMwZWoyYzAifQ.Am7Vl0gPK5zeEMLAvOiQNg"
console.log("Hello")
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 3
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",function(data){
      function styleInfo(features){
          return{

          
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(features.properties.mag),
          color: "#00000",
          radius: getMag(features.properties.mag),
          stroke: true,
          weight: 0.5,


          };
      }
      function getColor(magnitude){
          switch (true){
              case magnitude > 5:
                  return "#ff0000";

                  case magnitude > 4:
                    return "#0000ff";

                    case magnitude > 3:
                        return "#00b33c";

                        case magnitude > 2:
                            return "#cc0099";

                            case magnitude > 1:
                                return "#ffa31a";

                                default:
                                    return "#000000"
          }
      }

      function getMag(magnitude){
          if (magnitude === 0){
              return 1;
          }
          return magnitude*4;
      }
      L.geoJson(data,{
          pointToLayer: function(feature,latlng){
          return L.circleMarker(latlng);
          },
          style: styleInfo,
          onEachFeature:function(feature,layer){
              layer.bindPopup("magnitude: "+feature.properties.mag+"<br>location: "+feature.properties.place)
          }
        }).addTo(myMap);
        var legend = L.control({
            position: "bottomright"
          });
          //Details for the legend
          legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var grades = [0, 1, 2, 3, 4, 5];
            var colors = [
              "#000000",
              "#ffa31a",
              "#cc0099",
              "#00b33c",
              "#0000ff",
              "#ff0000"
            ];
            //Loop through intervals to generate a label with a colored square for each interval.
            for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }
            return div;
          };
          //Put legend to the map.
          legend.addTo(myMap);
  });
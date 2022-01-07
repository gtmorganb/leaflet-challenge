// geojson url 
var mapUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function createMap(response) {
    var myMap = L.map("map", {
        center: [37.0902, -110.7129], 
        zoom: 5
    }); 

    //create tile later in background of map 
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
        {
            attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/light-v10",
            accessToken: API_KEY 
        }).addTo(myMap); 

        L.geoJSON(response, {
            //create circle markers 
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag), 
                    fillColor: magColor(feature.properties.mag), 
                    color: "#000", 
                    weight: 0.3, 
                    opacity: 0.5, 
                    fillOpacity: 1
                });
            }, 
            //use onEachFeature to display necessary data 
            onEachFeature: onEachFeature
        }).addTo(myMap)

        function onEachFeature(feature, layer) {
            var format = d3.timeFormat("%d-%b-%Y at %H:%M"); 
            layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong><Time: 
            </strong>${format(new Date(feature.properties.time))}<br><strong> Magnitude: </strong>${feature.properties.mag}`);
        }; 

        //legend 
        var legend = L.control({position: "bottomright"}); 
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend"); 
            var magnitudes = [0,1,2,3,4,5]; 
            var labels = []; 
            var legendInfo = "<h5>Magnitude</h5>"; 
            div.innerHTML = legendInfo; 

            //personalize each magnitude 
            for (var i = 0; i < magnitudes.length; i++) {
                labels.push('<li style = "background-color:' + magColor(magnitudes[i] + 1) + '"><span>'
                +magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i+1]+ '': '+') + '</span></li>');
            }

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";

            return div; 
        }; 

        //add legend to map 
        legend.addTo(myMap);

}; //end createMap

//make markersize dependent on earthquake magnitude 
function markerSize(magnitude) {
    return magnitude*5; 
}; 

//make marker color dependent on magnitude 
function magColor(magnitude) {
    if (magnitude <=1) {
        return "#a7fb09"
    } else if (magnitude <=2) {
        return "#dcf900"
    } else if (magnitude <=3) {
        return "#f6de1a"
    } else if (magnitude <=4) {
        return "#fbb92e"
    } else if (magnitude <=5) {
        return "#faa35f"
    } else {
        return "#ff5967"
    }
}; 

//use API to get json from website 
d3.json(mapUrl, function(response) {
     createMap(response.features); 
}); 
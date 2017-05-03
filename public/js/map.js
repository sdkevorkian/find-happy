var map;

var initMap = function() {

    // center map on coordinates of address selected
    var addressCoords = { lat: address.lat, lng: address.long };
    map = new google.maps.Map(document.getElementById('map'), {
        center: addressCoords,
        zoom: 15
    });


    // var position = new google.maps.LatLng(address.lat, address.long);
    // display marker for address
    var addressMarker = new google.maps.Marker({
        position: { lat: address.lat, lng: address.long },
        title: address.name,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
    // Bind a popup to the  address marker
    addressMarker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: '<h3>' + address.name + '</h3>'
        });
        infoWindow.open(map, addressMarker);
    });

};


//display all yelp search results, may want to make api call in this page?? separate out init map with populate map?
var displayYelpResults = function(coordinates, name) {
    var resultMarker = new google.maps.Marker({
        position: { lat: coordinates.latitude, lng: coordinates.longitude },
        title: name,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"

    });

    resultMarker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: '<h3>' + name + '</h3>'
        });
        infoWindow.open(map, resultMarker);
    });
};


//  beginning of app
$(function() {
    var businesses = yelpSearch.businesses;
    businesses.forEach(function(business) {
        displayYelpResults(business.coordinates, business.name);
        console.log(business);
    });

});

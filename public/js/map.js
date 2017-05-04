// click handler that redirects using jquery ajax


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


//display all yelp search results
var displayYelpResults = function(business) {

    var resultMarker = new google.maps.Marker({
        position: { lat: business.coordinates.latitude, lng: business.coordinates.longitude },
        title: business.name,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"

    });

    resultMarker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: '<h3>' + business.name + '</h3>'
        });
        infoWindow.open(map, resultMarker);
        var html = `
        <img src="${business.image_url}">
        <p>${business.display_phone}</p>
        <p>${Math.round(business.distance)}m away</p>
        <p>${business.price}</p>
        <p>${business.rating}/5</p>
        <p><a href="${business.url} target="_blank">view on yelp</a></p>`;


        $('#display-yelp-result').html(html);

    });
};


//  beginning of app
$(function() {
    var businesses = yelpSearch.businesses;
    businesses.forEach(function(business) {
        displayYelpResults(business);

    });

});

var initMap = function() {

    // center map on coordinates of address selected
    var addressCoords = { lat: address.lat, lng: address.long };
    var map = new google.maps.Map(document.getElementById('map'), {
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

    //display all yelp search results, may want to make api call in this page?? separate out init map with populate map?


};



//  beginning of app
$(function() {
    console.log("running");

});

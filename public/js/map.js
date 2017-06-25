// click handler that redirects using jquery ajax


var map;
var prevInfoWindow;
var initMap = function() {

    // center map on coordinates of address selected
    var addressCoords = { lat: address.lat, lng: address.long };
    map = new google.maps.Map(document.getElementById('map'), {
        center: addressCoords,
        zoom: 14,
        styles: [{
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#e0efef"
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "hue": "#1900ff"
            }, {
                "color": "#c0e8e8"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
                "lightness": 100
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "on"
            }, {
                "lightness": 700
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#7dcdcd"
            }]
        }]
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
        console.log(prevInfoWindow);
        if (prevInfoWindow) {
            prevInfoWindow.close();
        }
        var infoWindow = new google.maps.InfoWindow({
            content: '<h4>' + business.name + '</h4>'
        });
        prevInfoWindow = infoWindow;
        infoWindow.open(map, resultMarker);
        $('#display-yelp-result').html(putYelpResultsOnPage(business));
    });



};

function putYelpResultsOnPage(business) {
    var html = `
        <h3>${business.name}</h3>
        <img src="${business.image_url}">
        <div class="address-details">
        <p>${business.display_phone}</p>
        <p>${(business.distance/1609).toFixed(1)}mi away</p>
        <p>rating: ${business.rating}/5</p>
        </div>
        <p><a href="${business.url}" target="_blank" class="btn teal lighten-3 waves-effect waves-light">view on yelp</a></p>`;
    if (currentUser) {
        html += `<form method="POST" action="/favorites">
            <input type="hidden" value="${business.id}" name="yelpId">
            <button class="btn teal lighten-3 waves-effect waves-light" type="submit"><i class="material-icons">favorite</i>add to favorites</button>
            </form>`;
    } else {
        html += '<div class="col s12"><a class="waves-effect waves-light btn-large teal lighten-3" href="/auth/login">LOGIN</a><a class="waves-effect waves-light btn-large teal lighten-3" href="/auth/signup">SIGN UP</a></div>';
    }
    return html;
}

function displayHoveredIconText() {
    var text = $(this).siblings().val();
    $("#search-option-desc").text(text);
}

function displayCheckedIconText() {
    var checkedRadioBtn = $('input[type="radio"]:checked');
    if (checkedRadioBtn) {
        $("#search-option-desc").text(checkedRadioBtn.val());
    }
}

// credit to: http://www.jquerybyexample.net/2012/05/how-to-get-querystring-value-using.html
function findSearchParameter() {
    var url = window.location.search;
    var findSearch = /=(\w+\+?\w+)/;
    var match = findSearch.exec(url);
    if (match) {
        return match[1].replace('+', ' ');
    } else {
        return null;
    }
}

function checkLastSearchedTerm(search) {
    if (search) {
        var radios = $('input[type="radio"]');
        radios.each(function() {
            if ($(this).val() === search) {
                $(this).prop("checked", true);
            }
        });
    }
}

//  beginning of app
$(function() {
    var businesses = yelpSearch.businesses;
    businesses.forEach(function(business) {
        displayYelpResults(business);
    });
    var lastSearch = findSearchParameter();
    checkLastSearchedTerm(lastSearch);
    var searchOptions = $(".search-icon");
    searchOptions.on("mouseover", displayHoveredIconText);
    searchOptions.on("mouseout", displayCheckedIconText);
});

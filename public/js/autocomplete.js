var autocomplete, address;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')));

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    address = autocomplete.getPlace();
    document.getElementById('autocomplete').value = address.name;

}

$("form").on("submit", function(e) {
    if (!address) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        e.preventDefault();
        $(".address-error").text("Please choose an address from the dropdown").addClass("error");
        return;
    }

});

$("input").on("focus", function() {
    address = null;
});

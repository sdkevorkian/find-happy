$(function() {
    console.log("help");
    $(".flash-alerts").fadeTo(2000, 500).slideUp(500, function() {
        $(".flash-alerts").slideUp(500);
    });
});

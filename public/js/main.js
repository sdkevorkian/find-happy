$(function() {
    $(".flash-alerts").fadeTo(2000, 1500).slideUp(1500, function() {
        $(".flash-alerts").slideUp(1500);
    });
});

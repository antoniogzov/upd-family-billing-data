$(function() {
    var mapId = 'map',
        mapCenter = [19.439175, -99.191482],
        mapMarker = true;
    if ($('#' + mapId).length > 0) {
        var icon = L.icon({
            iconUrl: 'icons/marker.png',
            iconSize: [37, 37],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        });
        var dragging = false,
            tap = false;
        if ($(window).width() > 700) {
            dragging = true;
            tap = true;
        }
        var map = L.map(mapId, {
            center: mapCenter,
            zoom: 16,
            dragging: dragging,
            tap: tap,
            scrollWheelZoom: false
        });
        //map.panTo(new L.LatLng(19.439175, -99.191482));
        var Stamen_TonerLite = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        Stamen_TonerLite.addTo(map);
        map.once('focus', function() {
            map.scrollWheelZoom.enable();
        });
        if (mapMarker) {
            var marker = L.marker(mapCenter, {
                icon: icon
            }).addTo(map);
            marker.bindPopup("<div class='p-4'><h5>Info Window Content</h5><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p></div>", {
                minwidth: 200,
                maxWidth: 600,
                className: 'map-custom-popup'
            })
        }
    }
});
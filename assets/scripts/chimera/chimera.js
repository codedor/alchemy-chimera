hawkejs.scene.on({type: 'set', name: 'pageCentral'}, applySave);
hawkejs.scene.on({type: 'set', name: 'pageCentral'}, applyGeopoint);

function applySave() {

	var $editor = $('.chimeraEditor').first(),
	    $save = $('.action-save', $editor);

	$save.off().click(function onClick(e) {

		var $fields = $('.chimeraEditor-input', $editor),
		    obj = {};

		$fields.each(function() {

			var $field = $(this);

			Object.setPath(obj, $field.attr('name'), $field.val());
		});

		hawkejs.scene.openUrl($save.attr('href'), null, obj, function(err, result) {
			console.log(err, result);
		})

		e.preventDefault();
	});
}

function applyGeopoint() {

	$('.geopoint-view').each(function eachGeopoint() {

		var $this = $(this),
		    lat,
		    lng,
		    map;

		lat = parseFloat($this.data('lat'));
		lng = parseFloat($this.data('lng'));

		// Skip this map if the coordinates are not numbers
		if (!isFinite(lat) || !isFinite(lng)) {
			return;
		}

		// Add the point to the map
		map = L.map($this.attr('id'), {
			dragging: false,
			touchZoom: false,
			center: [lat+0.0012, lng],
			zoomControl: false,
			attributionControl: false,
			scrollWheelZoom: 'center',
			minZoom: 13,
			maxZoom: 15,
			zoom: 14
		});

		L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: '',
			maxZoom: 16
		}).addTo(map);

		L.marker([lat, lng]).addTo(map);
	});
}

$(document).ready(function() {
	applySave();
});

$(window).load(function() {
	applyGeopoint();
})

hawkejs.scene.on({type: 'set', name: 'pageCentral', template: 'chimera/editor/edit'}, applySave);
hawkejs.scene.on({type: 'set', implement: 'chimera/fields/geopoint_list'}, applyGeopoint);

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

function applyGeopoint(el, block) {

	var wrapper = el.getElementsByClassName('geopoint-view')[0],
	    lat,
	    lng,
	    map;

	if (wrapper == null) {
		//Wrapper element not found, can't create map
		return;
	}

	lat = parseFloat(wrapper.getAttribute('data-lat'));
	lng = parseFloat(wrapper.getAttribute('data-lng'));

	// Skip this map if the coordinates are not numbers
	if (!isFinite(lat) || !isFinite(lng)) {
		return;
	}

	// Add the point to the map
	map = L.map(wrapper, {
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
}
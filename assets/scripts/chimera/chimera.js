hawkejs.scene.on({type: 'set', name: 'pageCentral', template: 'chimera/editor/edit'}, applySave);
hawkejs.scene.on({type: 'create', template: 'chimera/field_wrappers/geopoint_list'}, listGeopoint);
hawkejs.scene.on({type: 'create', implement: 'chimera/fields/geopoint_edit'}, editGeopoint);

function applySave() {

	var $editor = $('.chimeraEditor').first(),
	    $save = $('.action-save', $editor);

	$save.click(function onClick(e) {

		var $fieldwrappers = $('.chimeraEditor-fieldWrap>x-hawkejs'),
		    obj = {};

		$fieldwrappers.each(function() {

			var $wrapper = $(this),
			    value = $wrapper.data('new-value'),
			    $field;

			if (value != null) {
				$field = $('input', $wrapper);
				Object.setPath(obj, $field.attr('name'), value);
			}
		});

		hawkejs.scene.openUrl($save.attr('href'), null, obj, function(err, result) {
			console.log(err, result);
		});

		e.preventDefault();
	});
}

function listGeopoint(el, block) {

	var options,
	    map;

	options = {
		dragging: false
	};

	map = applyGeopoint(el, options);
}

function editGeopoint(el, block) {

	var options,
	    result,
	    marker,
	    map,
	    $el;

	$el = $(el);

	options = {
		minZoom: 1,
		maxZoom: 16,
		dragging: true,
		editable: true
	};

	result = applyGeopoint(el, options);
	map = result[0];
	marker = result[1];

	marker.on('dragend', function afterDrag() {
		var coordinates = marker.getLatLng();
		$el.data('new-value', [coordinates.lat, coordinates.lng]);
	});
}

function applyGeopoint(el, _options) {

	var markOptions,
	    wrapper = el.getElementsByClassName('geopoint-div')[0],
	    options,
	    marker,
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

	options = {
		dragging: false,
		touchZoom: false,
		center: [lat+0.0012, lng],
		zoomControl: false,
		attributionControl: false,
		scrollWheelZoom: 'center',
		minZoom: 13,
		maxZoom: 15,
		zoom: 14
	};

	Object.assign(options, _options);

	// Add the point to the map
	map = L.map(wrapper, options);

	L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: '',
		maxZoom: 16
	}).addTo(map);

	markOptions = {};

	if (options.editable === true) {
		markOptions.draggable = true;
	}

	marker = L.marker([lat, lng], markOptions).addTo(map);

	return [map, marker];
}

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/default_edit'}, function(el) {

	var $el = $(el),
	    $input = $('.chimeraEditor-input', $el);

	$input.change(function onDefaultEdit() {
		$el.data('new-value', $input.val());
	});
});
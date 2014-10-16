hawkejs.scene.on({type: 'set', name: 'pageCentral', template: 'chimera/editor/edit'}, applySave);
hawkejs.scene.on({type: 'set', name: 'pageCentral', template: 'chimera/editor/add'}, applySave);
hawkejs.scene.on({type: 'create', template: 'chimera/field_wrappers/geopoint_list'}, listGeopoint);
hawkejs.scene.on({type: 'create', implement: 'chimera/fields/geopoint_view'}, listGeopoint);
hawkejs.scene.on({type: 'create', implement: 'chimera/fields/geopoint_edit'}, editGeopoint);

function applySave(el) {

	var preventDuplicate,
	    variables,
	    isDraft,
	    $editor,
	    $save;

	variables = this.filter.variables || {};
	isDraft = this.filter.implement === 'chimera/editor/add';

	$editor = $('.chimeraEditor', el).first();
	$save = $('.action-save', $editor);

	$save.click(function onClick(e) {

		var $fieldwrappers,
		    data,
		    obj;

		if (preventDuplicate === true) {
			throw new Error('Already pressed save button');
		}

		$fieldwrappers = $('.chimeraEditor-fieldWrap>x-hawkejs', $editor);
		data = {};
		obj = {
			create: isDraft,
			data: data
		};

		if (isDraft) {
			// Set the initial passed-along-by-server values first
			Object.each(variables.groups, function eachGroup(group, name) {
				group[0].fields.forEach(function eachField(entry) {
					if (entry.value != null) {
						Object.setPath(data, entry.field.path, entry.value);
					}
				});
			});
		}

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
		preventDuplicate = true;
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

	if (!result) {
		throw new Error('Map wrapper could not be created');
	}

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
console.log(el)
	if (wrapper == null) {
		throw new Error('Wrapper element not found, can\'t create map');
	}

	lat = parseFloat(wrapper.getAttribute('data-lat'));
	lng = parseFloat(wrapper.getAttribute('data-lng'));

	// Skip this map if the coordinates are not numbers
	if (!isFinite(lat) || !isFinite(lng)) {
		lat = 51.044821;
		lng = 3.738785;
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

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/default_edit'}, function editDefault(el) {

	var $el = $(el),
	    $input = $('.chimeraEditor-input', $el);

	$input.change(function onDefaultEdit() {
		$el.data('new-value', $input.val());
	});
});

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/boolean_edit'}, function editBoolean(el) {

	var $el = $(el),
	    $input = $('.chimeraEditor-input', $el);

	$input.change(function onBooleanEdit() {
		$el.data('new-value', $input.is(':checked'));
	});
});

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/datetime_edit'}, function editDatetime(el) {
	applyDateField(el, 'datetime');
});

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/date_edit'}, function editDate(el) {
	applyDateField(el, 'date', {time: false});
});

hawkejs.scene.on({type: 'create', implement: 'chimera/fields/time_edit'}, function editTime(el) {
	applyDateField(el, 'time', {date: false});
});

function applyDateField(el, type, options) {

	var $el = $(el),
	    $wrapper = $('.chimeraEditor-' + type + '-edit', $el),
	    calender,
	    value;

	value = $wrapper.data('value');

	if (value != null) {
		value = new Date(value);
	}

	options = Object.assign({weekStart: 1, initialValue: value}, options);

	// Apply `rome`
	calender = rome($wrapper[0], options);

	calender.on('data', function dateChange(dateString) {
		var newdate = calender.getDate();
		$el.data('new-value', newdate);
	});
}
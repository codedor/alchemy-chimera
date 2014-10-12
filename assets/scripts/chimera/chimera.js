console.log('hello')

hawkejs.scene.on({type: 'set', name: 'pageCentral'}, applySave);

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

applySave();
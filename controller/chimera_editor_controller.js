/**
 * The Chimera Editor Controller class
 *
 * @author        Jelle De Loecker   <jelle@kipdola.be>
 * @since         0.2.0
 * @version       0.2.0
 */
var Editor = Function.inherits('ChimeraController', function EditorChimeraController(conduit, options) {

	this.constructor.super.call(this, conduit, options);

	this.addComponent('paginate');

	this.addAction('model', 'index', {title: 'List'});
	this.addAction('record', 'edit');
	this.addAction('record', 'view');

});



/**
 * The index action
 *
 * @param   {Conduit}   conduit
 */
Editor.setMethod(function index(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera;

	var actionFields = chimera.getActionFields('list'),
	    general = actionFields.getGroup('general'),
	    sorted = general.getSorted(false);

	var fields = [];

	for (var i = 0; i < sorted.length; i++) {
		fields.push(sorted[i].path);
	}

	this.components.paginate.find(model, {fields: fields}, function(err, items) {

		actionFields.processRecords('general', model, items, function(err, results) {

			if (err) {
				pr(err);
			}

			console.log(results);

			that.conduit.set('fields', general);
			that.conduit.set('records', results);
			that.conduit.set('actions', that.getActions());
			that.conduit.set('modelName', modelName);
			that.conduit.internal('modelName', modelName);
			that.conduit.set('pageTitle', modelName.humanize());

			that.render('chimera/editor/index');
		});

		//conduit.set('indexItems', items);
		//conduit.set('indexFields', chimera.getIndexFields());

		
	});
});
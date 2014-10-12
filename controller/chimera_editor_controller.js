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
	this.addAction('record', 'save', {handleManual: true});

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

		actionFields.processRecords('general', model, items, function groupedRecords(err, results) {

			if (err) {
				pr(err);
			}

			that.conduit.set('fields', general);
			that.conduit.set('records', results.general);
			that.conduit.set('actions', that.getActions());
			that.conduit.set('modelName', modelName);
			that.conduit.internal('modelName', modelName);
			that.conduit.set('pageTitle', modelName.humanize());

			that.render('chimera/editor/index');
		});
	});
});

/**
 * The edit action
 *
 * @param   {Conduit}   conduit
 */
Editor.setMethod(function edit(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera,
	    id = conduit.routeParam('id');

	var actionFields = chimera.getActionFields('edit'),
	    groups = actionFields.groups.clone();

	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, items) {

		actionFields.processRecords(model, items, function groupedRecords(err, groups) {

			if (err) {
				pr(err);
			}

			that.set('groups', groups);
			that.set('actions', that.getActions());
			that.set('modelName', modelName);
			that.set('pageTitle', modelName.humanize());
			that.internal('modelName', modelName);
			that.internal('recordId', id);

			that.render('chimera/editor/edit');
		});
	});
});

/**
 * The save action
 *
 * @param   {Conduit}   conduit
 */
Editor.setMethod(function save(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera,
	    id = conduit.routeParam('id'),
	    data = conduit.body.data,
	    record;

	var actionFields = chimera.getActionFields('edit'),
	    groups = actionFields.groups.clone();

	record = data[modelName.classify()];
	record._id = alchemy.castObjectId(id);

	pr(record, true);

	model.save(record, function afterSave(err) {
		that.edit(conduit);
	});

	return;

	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, items) {

		actionFields.processRecords(model, items, function groupedRecords(err, groups) {

			if (err) {
				pr(err);
			}

			that.set('groups', groups);
			that.set('actions', that.getActions());
			that.set('modelName', modelName);
			that.set('pageTitle', modelName.humanize());

			that.render('chimera/editor/edit');
		});
	});
});
/**
 * Chimera Action Fields: collection of fields
 *
 * @constructor
 *
 * @author        Jelle De Loecker   <jelle@codedor.be>
 * @since         1.0.0
 * @version       1.0.0
 */
var ActionFields = Function.inherits(function ChimeraActionFields(model, name, options) {

	this.model = model;
	this.name = name;
	this.options = Object.assign({}, options);

	this.groups = new Deck();
});

/**
 * Add a field to this action group
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {String}   name      The name of the field inside the schema
 * @param    {Object}   options
 */
ActionFields.setMethod(function addField(name, options) {

	var fieldType,
	    group,
	    field;

	// Get the fieldType instance from the model
	fieldType = this.model.getField(name);

	if (fieldType == null) {
		throw new Error('Field ' + name + ' does not exist');
	}

	if (options == null) {
		options = {};
	}

	if (options.action == null) {
		options.action = this.name;
	}

	if (options.group == null) {
		options.group = 'general';
	}

	// Get the chimera field
	field = fieldType.getChimeraField(options);

	// Get the group deck
	group = this.groups.get(options.group, Deck.create);

	group.push(field);
});

/**
 * Get the fields of a specific group as a deck
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {String}   group      The name of the group (general)
 *
 * @return   {Deck}
 */
ActionFields.setMethod(function getGroup(name) {

	if (name == null) {
		name = 'general';
	}

	return this.groups.get(name).clone();
});

/**
 * Process found records
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {String}    groupName
 * @param    {Array}     records
 * @param    {Function}  callback
 */
ActionFields.setMethod(function processRecords(groupName, model, records, callback) {

	var that = this,
	    tasks,
	    group;

	if (Array.isArray(groupName)) {
		callback = records;
		records = groupName;
		groupName = 'general';
	}

	tasks = new Array(records.length);

	records.forEach(function eachRecord(record, index) {
		tasks[index] = function taskRecord(nextRecord) {
			that.processRecord(groupName, model, record, nextRecord);
		};
	});

	Function.parallel(tasks, function doneProcessing(err, results) {
		callback(err, results);
	});
});

/**
 * Process a single record
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {String}    groupName
 * @param    {Object}    record
 * @param    {Function}  callback
 */
ActionFields.setMethod(function processRecord(groupName, model, record, callback) {

	var that = this,
	    fields,
	    tasks,
	    id;

	if (typeof groupName !== 'string') {
		callback = record;
		record = model;
		model = groupName;
		groupName = 'general';
	}

	if (record != null && record[model.name] != null && record[model.name]._id != null) {
		id = record[model.name]._id;
	} else {
		setImmediate(function errorId() {
			callback(new Error('No record and/or valid id was found'));
		});
		return;
	}

	tasks = [];
	fields = this.groups.get(groupName).getSorted(false);

	fields.forEach(function eachField(field, index) {

		tasks.push(function taskFieldValue(nextValue) {
			field.actionValue(that.name, record, function gotValue(err, result) {

				if (err != null) {
					return nextValue(err);
				}

				nextValue(null, {field: field, value: result});
			});
		});
	});

	Function.parallel(tasks, function afterFieldTasks(err, results) {
		callback(null, {id: id, fields: results});
	});
});
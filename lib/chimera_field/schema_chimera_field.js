/**
 * Schema Chimera Field
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {FieldType}
 */
var SchemaChimeraField = Function.inherits('ChimeraField', function SchemaChimeraField(fieldType, options) {

	SchemaChimeraField.super.call(this, fieldType, options);

	this.viewname = 'schema';
	this.viewwrapper = 'schema';
});

/**
 * Get the value to use in the action
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {String}   actionType
 * @param    {Object}   record
 * @param    {Function} callback
 */
SchemaChimeraField.setMethod(function actionValue(actionType, record, callback) {

	var actionFields,
	    subRecord,
	    schema,
	    field,
	    temp;

	schema = this.fieldType.getSubschema(record);

	if (typeof schema != 'object' || schema == null) {
		return callback(null);
	}

	actionFields = new alchemy.classes.ChimeraActionFields(schema, 'edit');
	subRecord = Object.path(record, this.path);

	actionFields.processRecord(schema, record, function gotResults(err, result) {

		if (err != null) {
			return callback(err);
		}

		callback(null, result);
	});
});
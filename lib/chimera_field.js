/**
 * Chimera Field
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {FieldType}
 */
var ChimeraField = Function.inherits(function ChimeraField(fieldType, options) {

	if (options == null) {
		options = {};
	}

	this.fieldType = fieldType;

	this.viewname = 'default';
	this.viewaction = options.action || 'list';

	// @todo: add real path
	this.path = fieldType.schema.parent.prototype.name + '.' + fieldType.name;
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
ChimeraField.setMethod(function actionValue(actionType, record, callback) {

	var value;

	value = Object.path(record, this.path);

	setImmediate(function() {
		callback(null, value);
	});
});

/**
 * Extend the FieldType model:
 * return a correct new associated Chimera Field instance
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 */
FieldType.setMethod(function getChimeraField(options) {

	var className;

	className = this.typename + 'ChimeraField';

	if (alchemy.classes[className] == null) {
		className = 'ChimeraField';
	}

	pr('Starting chimerafield: ' + className + ' for field type ' + this.typename, true)

	return new alchemy.classes[className](this, options);

});
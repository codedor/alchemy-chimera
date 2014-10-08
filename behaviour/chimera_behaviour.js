/**
 * The Chimera Behaviour
 *
 * @constructor
 * @extends       alchemy.classes.Behaviour
 *
 * @author        Jelle De Loecker   <jelle@codedor.be>
 * @since         1.0.0
 * @version       1.0.0
 */
var Chimera = Function.inherits('Behaviour', function ChimeraBehaviour(model, options) {

	Behaviour.call(this, model, options);

});

/**
 * See if this model's blueprint contains translation fields
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @return   {Boolean}
 */
Chimera.setMethod(function containsTranslations() {

	for (key in this.model.blueprint) {
		if (this.model.blueprint[key].translatable) {
			return true;
		}
	}

	return false;
});

/**
 * Get the fields to show in the index
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @return   {Array}
 */
Chimera.setMethod(function getIndexFields() {

	var modelName,
	    fields = [],
	    key;

	modelName = this.model.name;

	return this.model.blueprint.getSorted();

	for (key in this.model.blueprint) {
		fields.push({field: modelName + '.' + key, config: this.model.blueprint[key]});
	}

	if (this.containsTranslations()) {
		fields.push({meta: 'translations'});
	}

	return fields;
});
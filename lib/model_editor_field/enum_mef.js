/**
 * The Enum field type
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  0.0.1
 */
alchemy.create('Select2MEF', function EnumMEF() {

	/**
	 * Get the list options (for selects)
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.1.0
	 * @version  0.1.0
	 *
	 * @param    {String}     value     A specific value to search on, optional
	 * @param    {Function}   callback
	 */
	this.options = function options(value, callback) {

		var list;

		if (typeof value == 'function') {
			callback = value;
			value = null;
		}

		list = this.getValues();

		list.forEach(function eachEntry(entry, index) {
			entry.text = entry.title || entry.id;
		});

		callback({results: list, available: list.length, more: false});
	};

	/**
	 * Get the values
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.1.0
	 * @version  0.1.0
	 *
	 * @return   {Array}
	 */
	this.getValues = function getValues() {

		var context = this.context || this.model,
		    values,
		    entry,
		    list,
		    name;

		if (!context) {
			return [];
		}

		list = [];

		if (context) {
			values = context[this.fieldName.pluralize()];

			if (values) {
				for (name in values) {
					entry = values[name];

					// Use the name as the id
					temp = {id: name};

					if (entry.title) {
						temp.title = entry.title;
					} else if (entry.name) {
						temp.title = entry.name;
					} else if (entry.toString) {
						temp.title = entry.toString();
					} else {
						temp.title = name;
					}

					// Add this value to the list
					list.push(temp);
				}
			}
		}

		return list;
	};

	this.input = function input(callback) {

		var that  = this,
		    value = this.value,
		    list  = [],
		    context,
		    values,
		    entry,
		    temp,
		    name;

		this.fieldView = 'select';

		context = this.model;

		if (this.context) {
			context = this.context;
		}

		list = this.getValues();

		this.value = {
			value: value,
			options: list
		};

		if (this.blueprintEntry.unique && context.find) {

			context.find('all', {fields: [this.fieldKey]}, function(err, results) {

				var exists = {},
				    i;

				// Get all the used values
				for (i = 0; i < results.length; i++) {
					exists[results[i][context.modelName][that.fieldKey]] = true;
				}

				// And remove them from the list
				for (i = 0; i < list.length; i++) {

					// Don't remove the current value, though
					if (exists[list[i].id] && list[i].id !== value) {
						list.splice(i, 1);
						i--;
					}
				}

				callback();
			});
		} else {
			callback();
		}
	};

	/**
	 * Modify the return value before saving
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.save = function save(callback) {

		// Treat empty strings as undefined
		if (this.value === '') {
			this.value = undefined;
		}

		callback();
	};

});
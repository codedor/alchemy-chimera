module.exports = function HawkejsChimera(Hawkejs, Blast) {

	var Chimera = Hawkejs.Helper.extend(function ChimeraHelper(view) {
		Hawkejs.Helper.call(this, view);
	});

	Chimera.setMethod(function printField(recordValue) {

		var that = this,
		    viewElement;

		viewElement = [];

		viewElement.push('chimera/fields/' + recordValue.field.viewname + '_' + recordValue.field.viewaction);

		// @todo: hawkejs: allow array of templates
		//viewElement.push('chimera/fields/default_' + recordValue.field.viewaction);

		this.view.implement(viewElement, {data: recordValue});
	});

	/**
	 * Print the actions for a given action type
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   type   model, list or record
	 */
	Chimera.setMethod(function printActions(type, options, subject) {

		var actionData,
		    routeName,
		    className,
		    rOptions,
		    actions,
		    action,
		    view,
		    name,
		    item,
		    temp,
		    val;

		if (!type) {
			throw new TypeError('Invalid action type given');
		}

		if (options == null) {
			options = {};
		}

		view = this.view;
		actionData = view.set('actions');
		routeName = type.classify() + 'Action';

		if (subject == null) {
			subject = {};
		}

		if (actionData[type] == null) {
			return;
		}
		console.log('\n\nActiondata:\n')

		actions = actionData[type].createIterator();

		while (actions.hasNext()) {
			action = actions.next().value;

			console.log(action);

			temp = {
				controller: action.controller,
				action: action.name,
				subject: view.internal('modelName'),
				id: view.internal('recordId') || subject.id
			};

			className = 'btn btn--' + type + ' action-' + action.name;

			if (options.className) {
				className += ' ' + options.className;
			}

			rOptions = {title: action.name, className: className};

			if (action.handleManual) {
				rOptions.handleManual = true;
			}

			view.print(' ');
			view.helpers.Router.printRoute(routeName, temp, rOptions);
		}
	});
};
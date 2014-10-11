module.exports = function HawkejsChimera(Hawkejs, Blast) {

	var Chimera = Hawkejs.Helper.extend(function ChimeraHelper(view) {
		Hawkejs.Helper.call(this, view);
	});

	Chimera.setMethod(function printField(recordValue) {

		var that = this,
		    viewElement;

		viewElement = 'chimera/fields/' + recordValue.field.viewname + '_' + recordValue.field.viewaction;

		//this.view.print('<pre>Printing element ' + viewElement + '</pre>');

		//this.view.print('<pre>' + JSON.dry(recordValue, null, 4) +'</pre>');

		this.view.async(function(next) {

			var subRender = new Hawkejs.ViewRender(that.view.hawkejs, true);
			subRender.execute(viewElement, {data: recordValue}, true);

			subRender.finish(function(err, result) {

				var html;

				html = subRender.blocks[subRender.mainBlock];

				next(null, html);
			});

		});

		//this.view.implement(viewElement, {data: recordValue});
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
	Chimera.setMethod(function printActions(type, subject) {

		var actionData,
		    routeName,
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

		view = this.view;
		actionData = view.set('actions');
		routeName = type.classify() + 'Action';

		if (subject == null) {
			subject = {};
		}

		if (actionData[type] == null) {
			return;
		}

		actions = actionData[type].createIterator();

		while (actions.hasNext()) {
			action = actions.next().value;

			temp = {
				controller: action.controller,
				action: action.name,
				subject: view.internal('modelName'),
				id: subject.id
			};

			view.helpers.Router.printRoute(routeName, temp, {title: action.name, className: 'btn btn--' + type + ' action-' + action.name});
		}
	});
};
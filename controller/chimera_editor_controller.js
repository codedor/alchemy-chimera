/**
 * The Chimera Editor Controller class
 *
 * @author        Jelle De Loecker   <jelle@kipdola.be>
 * @since         0.2.0
 * @version       0.2.0
 */
var Editor = Function.inherits('ChimeraController', function ChimeraEditorsController(conduit, options) {

	ChimeraEditorsController.super.call(this, conduit, options);

	this.addComponent('paginate');

});

/**
 * The index action
 *
 * @param   {Conduit}   conduit
 */
Editor.setMethod(function index(conduit, modelName) {

	var that = this,
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera;

	this.components.paginate.find(model, 'all', function(err, items) {

		pr(items, true);

		conduit.set('indexItems', items);
		conduit.set('indexFields', chimera.getIndexFields());

		that.render('chimera/editor/index');
	});
});
/**
 * Setting model
 *
 * @constructor
 *
 * @author   Kjell Keisse   <kjell@codedor.be>
 * @since    0.2.0
 * @version  0.2.0
 */
var Setting = Model.extend(function SettingModel(options) {

	var chimera,
	    edit;

	SettingModel.super.call(this, options);

	// Create the chimera behaviour
	chimera = this.addBehaviour('chimera');

	// Get the edit group
	edit = chimera.getActionFields('edit');
	edit.addField('email');
	edit.addField('google_analytics');


});

Setting.addField('email', 'String');
Setting.addField('google_analytics', 'String', {default: 'UA-XXXXX-Y'});
// Create a new chimera section
var chimera = Router.section('chimera', '/' + alchemy.plugins.chimera.routename);

chimera.get('Dashboard', '/', 'ChimeraStatic#dashboard');

chimera.add(['get', 'post'], 'ModelIndex', '/editor/:modelName', 'ChimeraEditor#index');
chimera.get('PageEditor', '/page_editor', 'ChimeraStatic#pageEditor');

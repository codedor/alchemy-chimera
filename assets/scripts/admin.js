$(window).load(function() {

	var addCollapseClasses = function() {
			$('#wrapper').addClass('collapsed');
			$('#navbar-sidebar').addClass('collapsed');
		},
		removeCollapseClasses = function() {
			$('#wrapper').removeClass('collapsed');
			$('#navbar-sidebar').removeClass('collapsed');
		};


	$('.side-nav').on('click', function(){
		$(this).find()
	});

	// Toggle collapsed class sidebar
	$('.collapse-sidebar').on('click', function() {
		$('#wrapper').toggleClass('collapsed');
		$('#navbar-sidebar').toggleClass('collapsed');
		$('.navbar-header').toggle();
	});

	// Add default icon menuitems
	$('.menu-item-text').each(function(){
		var current_element = $(this);
		var previous_element = $(this).prev().prop('tagName');;
		if(previous_element != 'I') {
			current_element.parent().prepend('<i class="fa fa-circle-o"></i>');
		}
		var anchor = current_element.closest('a');
		anchor.attr({
			title: anchor.find('span.menu-item-text').text(),
			'data-toggle': 'tooltip',
			'data-placement': 'right'
		}).tooltip();
	});

	/*$('#sidebar-wrapper li').each(function(){
		$(this).attr({'data-parent': '#sidebar-wrapper'});
	});*/

	$('#sidebar-wrapper li').on('click', function(){
		var current_element = $(this);
		current_element.addClass('clicked');

		$('#sidebar-wrapper li:not(.clicked)').each(function(){
			//console.log($.contains($(this), current_element));
				$(this).removeClass('open');
		});

		current_element.removeClass('clicked');
	});

	if($(window).width() < 768) {
		addCollapseClasses();
	}
	if($(window).width() > 992) {
		removeCollapseClasses();
	}

	$(window).resize(function() {
		var width = $(window).width();
		if(width < 768) {
			addCollapseClasses();
		}
	});

});
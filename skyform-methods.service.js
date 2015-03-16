(function() {
	'use strict';

	angular.module('skyform').service('skyformMethods', skyformMethods);

	function skyformMethods() {
		var addHover=function(element,wrap) {
			/* Hover methods*/
			element.on('mouseover', function() {
				wrap.addClass('hover');
			});
			element.on('mouseout',function() {
				wrap.removeClass('hover');
			});
		};
		var addFocus=function(element,wrap) {
			/* Focus methods*/
			element.on('focus', function() {
				wrap.addClass('focus');
			});
			element.on('blur', function() {
				wrap.removeClass('focus');
			});
		};

		var addActive = function(element,wrap) {
			/* control 'active'-class */
			element.on('mousedown', function() {
				wrap.addClass('active');
				angular.element(document).one('mouseup', function() {
					wrap.removeClass('active');
				});
			});
		};

		var moveId = function(element,wrap) {
			/* should this be deprecated, since its only for uniform... */
			if(element.attr('id') && element != wrap) {
				wrap.attr('id','uniform-'+element.attr('id'));
			}
		};

		return {
			addHover:addHover,
			addFocus:addFocus,
			addActive:addActive,
			moveId:moveId
		};
	}

})();

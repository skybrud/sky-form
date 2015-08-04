declare module sky {
	interface skyformFields {
		add(element:Element, fn:any):void;
		remove(Element):void;
		update(Element):void;
	}
	
	interface skyformMethods {
		addHover(element:Element, wrap:Element):void;
		addFocus(element:Element, wrap:Element):void;
		addActive(element:Element, wrap:Element):void;
		moveId(element:Element, wrap:Element):void;
	}
}

(function() {
	'use strict';

	angular.module('skyform').service('skyformMethods', skyformMethods);

	function skyformMethods():sky.skyformMethods {

		var _this = this;

		_this.addHover=function(element,wrap) {
			/* Hover methods*/
			element.on('mouseover', function() {
				wrap.addClass('hover');
			});
			element.on('mouseout',function() {
				wrap.removeClass('hover');
			});
		};
		_this.addFocus=function(element,wrap) {
			/* Focus methods*/
			element.on('focus', function() {
				wrap.addClass('focus');
			});
			element.on('blur', function() {
				wrap.removeClass('focus');
			});
		};

		_this.addActive = function(element,wrap) {
			/* control 'active'-class */
			element.on('mousedown', function() {
				wrap.addClass('active');
				angular.element(document).one('mouseup', function() {
					wrap.removeClass('active');
				});
			});
		};

		_this.moveId = function(element,wrap) {
			/* should this be deprecated, since its only for uniform... */
			if(element.attr('id') && element != wrap) {
				wrap.attr('id','uniform-'+element.attr('id'));
			}
		};

		return this;
	}

})();

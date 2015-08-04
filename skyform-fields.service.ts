/* TODO: add module sky */
interface PublicSkyFormMethods {
	add(DOMElement:Element):void;
	update():void;
}

interface Window {
    skyform?: PublicSkyFormMethods;
}

(function() {
	'use strict';

	angular.module('skyform').service('skyformFields',skyformFields);

	skyformFields.$inject = ['$rootScope','$compile'];

	function skyformFields($rootScope,$compile):skyformFields {
		var _this=this;

		var fields = [];

		_this.add = function(element, fn, wrap) {
			fields.push({element:element, wrap:wrap, fn:fn});
		};

		_this.remove = function(element) {
			var index=-1;
			angular.forEach(fields, function(field,key) {
				if(field.element === element) {
					index=key;
				}
			});
			fields.splice(index, 1);
		};

		_this.update = function(userField) {
			angular.forEach(fields, function(field) {
				if(!userField || userField == field.element) {
					field.fn();
					if(field.element.disabled) {
						field.wrap.addClass('disabled');
					} else {
						field.wrap.removeClass('disabled');
					}
				}
			});
		};

		$rootScope.$on('skyform.update',function() {
			_this.update();
		});

		/* Assigning this method to the window, so its available from outside angular... */
		window.skyform={
			update:_this.update,
			add:function(ele) {
				$compile(angular.element(ele))($rootScope);
			}
		};

		return this;
	}

})();

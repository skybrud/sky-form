(function() {
	'use strict';

	angular.module('skyform').service('skyformFields',skyformFields);

	skyformFields.$inject = ['$rootScope','$compile'];

	function skyformFields($rootScope,$compile) {
		var _this=this;

		var fields = [];

		_this.add = function(element, fn) {
			fields.push({element:element, fn:fn});
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
				}
			});
		};

		$rootScope.$on('skyform.update',function() {
			_this.update();
		});

		/* Assigning this method to the window, so its available from outside angular... */
		window.skyform={};
		window.skyform.update = _this.update;
		window.skyform.add = function(ele) {
			$compile(angular.element(ele))($rootScope);
		};
	}

})();

(function() {
	'use strict';

	angular.module('skyform').directive('textarea', textarea);

	textarea.$inject = ['skyformMethods','skyformFields'];

	function textarea(skyformMethods, skyformFields) {
		var directive = {
			restrict:'E',
			link:link
		};

		function link(scope,element,attributes) {

			if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
				return false;
			}

			element.addClass('uniform');
			skyformMethods.addHover(element,element);
			skyformMethods.addFocus(element,element);
			skyformMethods.addActive(element,element);

			skyformFields.add(element[0],null);
			scope.$on('$destroy', function() {
				skyformFields.remove(element[0]);
			});
		}

		return directive;
	}
})();

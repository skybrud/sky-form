(function() {
	'use strict';

	angular.module('skyform').directive('button', button);

	button.$inject = ['skyformMethods', 'skyformFields'];

	function button(skyformMethods, skyformFields) {
		var directive = {
			restrict: 'E',
			link: link
		};

		function link(scope,element,attributes) {
			if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
				return false;
			}

			var wrap = element.wrap(angular.element('<div class="button"></div>')).parent();
			var valueHolder = angular.element('<span></span>');

			wrap.append(valueHolder);

			var updateValue = function() {
				valueHolder.html(element.html());
			};
			updateValue();

			skyformMethods.addHover(element, wrap);
			skyformMethods.addFocus(element, wrap);
			skyformMethods.addActive(element, wrap);
			skyformMethods.moveId(element, wrap);

			skyformFields.add(element[0], updateValue, wrap);
			scope.$on('$destroy', function() {
				skyformFields.remove(element[0]);
			});
		}

		return directive;

	}
})();

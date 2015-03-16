(function() {
	'use strict';
	angular.module('skyform').directive('select',select);

	select.$inject = ['skyformMethods', 'skyformFields', '$timeout'];

	function select(skyformMethods, skyformFields, $timeout) {
		var directive = {
			restrict:'E',
			link:link
		};

		function link(scope,element,attributes) {

			if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
				return false;
			}

			/* select[multiple] is not currently supported */
			if(attributes.multiple || attributes.multiple === "") {
				return false;
			}

			var wrap = element.wrap(angular.element('<div class="selector"></div>')).parent();
			var valueHolder = angular.element('<span></span>');

			wrap.append(valueHolder);

			var updateValue = function() {
				valueHolder.html(angular.element(element[0].querySelector(':checked')).html());
			};

			/* Set initial value in view after timeout, to fix an issue when options are passed via ngRepeat */
			$timeout(function() {
				updateValue();
			},0);

			/* Update value on model-changes (if angular-field) */
			scope.$watch(attributes.ngModel, function() {
				updateValue();
			});

			/* Update value on element-change */
			element.on('change', function() {
				updateValue();
			});

			/* Update value if the attribute updates in a $digest (e.g. value="{{something}}") */
			attributes.$observe('value', function() {
				updateValue();
			});

			skyformMethods.addHover(element,wrap);
			skyformMethods.addFocus(element,wrap);
			skyformMethods.moveId(element,wrap);
			/* SELECTS has no .active state */

			skyformFields.add(element[0],updateValue);
			scope.$on('$destroy', function() {
				skyformFields.remove(element[0]);
			});

		}

		return directive;
	}

})();

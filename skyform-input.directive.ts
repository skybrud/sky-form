(function() {
	'use strict';

	angular.module('skyform').directive('input', input);

	input.$inject = ['skyformMethods','skyformRadios','skyformFields'];

	function input(skyformMethods,skyformRadios,skyformFields) {
		var directive = {
			restrict:'E',
			link:link
		};

		function link(scope,element,attributes) {
			if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
				return false;
			}
			var wrap, updateValue, valueHolder;

			if(element.attr('type') == 'file') {
				wrap = element.wrap(angular.element('<div class="uploader"></div>')).parent();
				valueHolder = angular.element('<span class="filename"></span>');
				var actionBtn = angular.element('<span class="action">Browse</span>');

				wrap.append(valueHolder);
				wrap.append(actionBtn);

				updateValue = function() {
					if (!element.val()) {
						valueHolder.html('Choose a file');
					} else {
						valueHolder.html(element.val());
					}
				};

			} else if(element.attr('type') == 'checkbox') {

				valueHolder = element.wrap(angular.element('<span></span>')).parent();

				wrap = valueHolder.wrap(angular.element('<div class="checker"></div>')).parent();

				updateValue = function() {
					if(element[0].checked) {
						valueHolder.addClass('checked');
					} else {
						valueHolder.removeClass('checked');
					}
				};

			} else if(element.attr('type') == 'radio') {

				valueHolder = element.wrap(angular.element('<span></span>')).parent();

				wrap = valueHolder.wrap(angular.element('<div class="radio"></div>')).parent();

				updateValue = function(calledExternal) {
					if(element[0].checked) {
						valueHolder.addClass('checked');
					} else {
						valueHolder.removeClass('checked');
					}
					if(!calledExternal) {
						skyformRadios.update(element[0].name);
					}
				};
				skyformRadios.add(element[0].name, updateValue);

			} else if(element.attr('type') == 'submit' || element.attr('type') == 'reset') {
				wrap = element.wrap(angular.element('<div class="button"></div>')).parent();
				valueHolder = angular.element('<span></span>');

				wrap.append(valueHolder);

				updateValue = function() {
					valueHolder.html(element.val());
				};

			} else if (element.attr('datepicker-popup')) {
				updateValue=function() {};
				wrap = element.wrap(angular.element('<div class="date-picker-wrapper"></div>')).parent();

				wrap.append(valueHolder);

			} else {
				updateValue=function() {};
				wrap = element;
				//since there is no wrap, just assign the element to the wrap variable, so the class-changes can still occur!

				element.addClass('uniform-input');
			}

			skyformMethods.addHover(element,wrap);
			skyformMethods.addFocus(element,wrap);
			skyformMethods.addActive(element,wrap);
			skyformMethods.moveId(element,wrap);

			/**
			 * Change-watchers that all just call updateValue()
			 *
			 **/

			element.on('change', function() {
				updateValue();
			});

			/* Update value on model-changes (if angular-field) */
			scope.$watch(attributes.ngModel, function() {
				updateValue();
			});

			if((element.attr('type') == 'radio') || (element.attr('type') == 'checkbox')) {
				/* Update value if the attribute updates in a $digest (e.g. value="{{something}}") */
				attributes.$observe('checked', function() {
					updateValue();
				});
			}
			attributes.$observe('value', function() {
				updateValue();
			});


			skyformFields.add(element[0], updateValue, wrap);

			//updateValue();
			skyformFields.update(element[0]);

			scope.$on('$destroy', function() {
				skyformFields.remove(element[0]);

				if(element.attr('type') == 'radio') {
					skyformRadios.remove(element[0].name, updateValue);
				}
			});

		}

		return directive;

	}
})();

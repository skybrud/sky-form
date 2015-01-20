/**
 * skyform
 * Enhancing the styleability of form-fields with AngularJS.
 *
 * @author Filip Bruun Bech-Larsen, @filipbech
 * @link https://github.com/filipbech/skyform
 * @license GNU GPL v2 License, https://raw.githubusercontent.com/filipbech/skyform/master/LICENSE
 */

/* global angular, window */
(function () {
	'use strict';

	angular.module('skyform',[]);

	angular.module('skyform').service('skyformMethods', function() {
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
	});

	angular.module('skyform').service('skyformRadios', function() {
		var _this=this;

		var radios = {};

		_this.add = function(name, fn) {
			if(!radios[name]) {
				radios[name]=[];
			}

			radios[name].push(fn);
		};

		_this.update = function(name) {
			angular.forEach(radios[name], function(updateFn) {
				// call with true, so it stops calling recursively
				updateFn(true);
			});
		};

		_this.remove = function(name, fn) {
			var index=-1;
			angular.forEach(radios[name], function(updateFn,key) {
				if(updateFn === fn) {
					index=key;
				}
			});
			radios[name].splice(index, 1);
		};
	});

	angular.module('skyform').service('skyformFields', ['$rootScope','$compile',function($rootScope,$compile) {
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
	}]);

	angular.module('skyform').directive('select',['skyformMethods','skyformFields',function (skyformMethods, skyformFields) {
		return {
			restrict:'E',
			link:function(scope,element,attributes) {

				if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
					return false;
				}

				/* select[multiple] is not currently supported */
				if(attributes.multiple || attributes.multiple === "") {
					return false;
				}

				var wrap = angular.element('<div class="selector"></div>');
				var valueHolder = angular.element('<span></span>');

				element.wrap(wrap);
				valueHolder.html(element.val());
				wrap.append(valueHolder);

				var updateValue = function() {
					valueHolder.html(element.val());
				};

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
		};
	}]);

	angular.module('skyform').directive('button', ['skyformMethods','skyformFields',function (skyformMethods, skyformFields) {
		return {
			restrict:'E',
			link:function(scope,element,attributes) {
				if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
					return false;
				}

				var wrap = angular.element('<div class="button"></div>');
				var valueHolder = angular.element('<span></span>');
				element.wrap(wrap);
				wrap.append(valueHolder);

				var updateValue = function() {
					valueHolder.html(element.html());
				};
				updateValue();

				skyformMethods.addHover(element,wrap);
				skyformMethods.addFocus(element,wrap);
				skyformMethods.addActive(element,wrap);
				skyformMethods.moveId(element,wrap);

				skyformFields.add(element[0],updateValue);
				scope.$on('$destroy', function() {
					skyformFields.remove(element[0]);
				});
			}
		};
	}]);

	angular.module('skyform').directive('textarea', ['skyformMethods','skyformFields',function (skyformMethods, skyformFields) {
		return {
			restrict:'E',
			link:function(scope,element,attributes) {

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
		};
	}]);

	angular.module('skyform').directive('input', ['skyformMethods','skyformRadios','skyformFields',function (skyformMethods,skyformRadios,skyformFields) {
		return {
			restrict:'E',
			link:function(scope,element,attributes) {
				if(attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
					return false;
				}
				var wrap, updateValue, valueHolder;

				if(element.attr('type') == 'file') {
					wrap = angular.element('<div class="uploader"></div>');
					valueHolder = angular.element('<span class="filename"></span>');
					var actionBtn = angular.element('<span class="action">Vælg fil</span>');

					element.wrap(wrap);
					wrap.append(valueHolder);
					wrap.append(actionBtn);

					updateValue = function() {
						if (!element.val()) {
							valueHolder.html('vælg en fil');
						} else {
							valueHolder.html(element.val());
						}
					};

				} else if(element.attr('type') == 'checkbox') {
					wrap = angular.element('<div class="checker"></div>');
					valueHolder = angular.element('<span></span>');

					element.wrap(valueHolder);
					valueHolder.wrap(wrap);

					updateValue = function() {
						if(element[0].checked) {
							valueHolder.addClass('checked');
						} else {
							valueHolder.removeClass('checked');
						}
					};

				} else if(element.attr('type') == 'radio') {
					wrap = angular.element('<div class="radio"></div>');
					valueHolder = angular.element('<span></span>');

					element.wrap(valueHolder);
					valueHolder.wrap(wrap);

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
					wrap = angular.element('<div class="button"></div>');
					valueHolder = angular.element('<span></span>');

					element.wrap(wrap);
					wrap.append(valueHolder);

					updateValue = function() {
						valueHolder.html(element.val());
					};

				} else if (element.attr('datepicker-popup')) {
					updateValue=function() {};
					wrap = angular.element('<div class="date-picker-wrapper"></div>');

					element.wrap(wrap);
					wrap.append(valueHolder);

				} else {
					updateValue=function() {};
					wrap = element;
					//since there is no wrap, just assign the element to the wrap variable, so the class-changes can still occur!

					element.addClass('uniform-input');
				}

				updateValue();

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

				/* Update value if the attribute updates in a $digest (e.g. value="{{something}}") */
				attributes.$observe('checked', function() {
					updateValue();
				});
				attributes.$observe('value', function() {
					updateValue();
				});

				skyformFields.add(element[0], updateValue);

				scope.$on('$destroy', function() {
					skyformFields.remove(element[0]);

					if(element.attr('type') == 'radio') {
						skyformRadios.remove(element[0].name, updateValue);
					}
				});

			}
		};
	}]);

})();


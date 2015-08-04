/**
 * skyform
 * Enhancing the styleability of form-fields with AngularJS.
 *
 * @author Filip Bruun Bech-Larsen, @filipbech
 * @link https://github.com/filipbech/skyform
 * @license GNU GPL v2 License, https://raw.githubusercontent.com/filipbech/skyform/master/LICENSE
 */
(function () {
    'use strict';
    angular.module('skyform', []);
})();
(function () {
    'use strict';
    angular.module('skyform').directive('button', button);
    button.$inject = ['skyformMethods', 'skyformFields'];
    function button(skyformMethods, skyformFields) {
        var directive = {
            restrict: 'E',
            link: link
        };
        function link(scope, element, attributes) {
            if (attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
                return false;
            }
            var wrap = element.wrap(angular.element('<div class="button"></div>')).parent();
            var valueHolder = angular.element('<span></span>');
            wrap.append(valueHolder);
            var updateValue = function () {
                valueHolder.html(element.html());
            };
            updateValue();
            skyformMethods.addHover(element, wrap);
            skyformMethods.addFocus(element, wrap);
            skyformMethods.addActive(element, wrap);
            skyformMethods.moveId(element, wrap);
            skyformFields.add(element[0], updateValue, wrap);
            scope.$on('$destroy', function () {
                skyformFields.remove(element[0]);
            });
        }
        return directive;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').service('skyformFields', skyformFields);
    skyformFields.$inject = ['$rootScope', '$compile'];
    function skyformFields($rootScope, $compile) {
        var _this = this;
        var fields = [];
        _this.add = function (element, fn, wrap) {
            fields.push({ element: element, wrap: wrap, fn: fn });
        };
        _this.remove = function (element) {
            var index = -1;
            angular.forEach(fields, function (field, key) {
                if (field.element === element) {
                    index = key;
                }
            });
            fields.splice(index, 1);
        };
        _this.update = function (userField) {
            angular.forEach(fields, function (field) {
                if (!userField || userField == field.element) {
                    field.fn();
                    if (field.element.disabled) {
                        field.wrap.addClass('disabled');
                    }
                    else {
                        field.wrap.removeClass('disabled');
                    }
                }
            });
        };
        $rootScope.$on('skyform.update', function () {
            _this.update();
        });
        /* Assigning this method to the window, so its available from outside angular... */
        window.skyform = {
            update: _this.update,
            add: function (ele) {
                $compile(angular.element(ele))($rootScope);
            }
        };
        return this;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').directive('input', input);
    input.$inject = ['skyformMethods', 'skyformRadios', 'skyformFields'];
    function input(skyformMethods, skyformRadios, skyformFields) {
        var directive = {
            restrict: 'E',
            link: link
        };
        function link(scope, element, attributes) {
            if (attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
                return false;
            }
            var wrap, updateValue, valueHolder;
            if (element.attr('type') == 'file') {
                wrap = element.wrap(angular.element('<div class="uploader"></div>')).parent();
                valueHolder = angular.element('<span class="filename"></span>');
                var actionBtn = angular.element('<span class="action">Browse</span>');
                wrap.append(valueHolder);
                wrap.append(actionBtn);
                updateValue = function () {
                    if (!element.val()) {
                        valueHolder.html('Choose a file');
                    }
                    else {
                        valueHolder.html(element.val());
                    }
                };
            }
            else if (element.attr('type') == 'checkbox') {
                valueHolder = element.wrap(angular.element('<span></span>')).parent();
                wrap = valueHolder.wrap(angular.element('<div class="checker"></div>')).parent();
                updateValue = function () {
                    if (element[0].checked) {
                        valueHolder.addClass('checked');
                    }
                    else {
                        valueHolder.removeClass('checked');
                    }
                };
            }
            else if (element.attr('type') == 'radio') {
                valueHolder = element.wrap(angular.element('<span></span>')).parent();
                wrap = valueHolder.wrap(angular.element('<div class="radio"></div>')).parent();
                updateValue = function (calledExternal) {
                    if (element[0].checked) {
                        valueHolder.addClass('checked');
                    }
                    else {
                        valueHolder.removeClass('checked');
                    }
                    if (!calledExternal) {
                        skyformRadios.update(element[0].name);
                    }
                };
                skyformRadios.add(element[0].name, updateValue);
            }
            else if (element.attr('type') == 'submit' || element.attr('type') == 'reset') {
                wrap = element.wrap(angular.element('<div class="button"></div>')).parent();
                valueHolder = angular.element('<span></span>');
                wrap.append(valueHolder);
                updateValue = function () {
                    valueHolder.html(element.val());
                };
            }
            else if (element.attr('datepicker-popup')) {
                updateValue = function () { };
                wrap = element.wrap(angular.element('<div class="date-picker-wrapper"></div>')).parent();
                wrap.append(valueHolder);
            }
            else {
                updateValue = function () { };
                wrap = element;
                //since there is no wrap, just assign the element to the wrap variable, so the class-changes can still occur!
                element.addClass('uniform-input');
            }
            skyformMethods.addHover(element, wrap);
            skyformMethods.addFocus(element, wrap);
            skyformMethods.addActive(element, wrap);
            skyformMethods.moveId(element, wrap);
            /**
             * Change-watchers that all just call updateValue()
             *
             **/
            element.on('change', function () {
                updateValue();
            });
            /* Update value on model-changes (if angular-field) */
            scope.$watch(attributes.ngModel, function () {
                updateValue();
            });
            if ((element.attr('type') == 'radio') || (element.attr('type') == 'checkbox')) {
                /* Update value if the attribute updates in a $digest (e.g. value="{{something}}") */
                attributes.$observe('checked', function () {
                    updateValue();
                });
            }
            attributes.$observe('value', function () {
                updateValue();
            });
            skyformFields.add(element[0], updateValue, wrap);
            //updateValue();
            skyformFields.update(element[0]);
            scope.$on('$destroy', function () {
                skyformFields.remove(element[0]);
                if (element.attr('type') == 'radio') {
                    skyformRadios.remove(element[0].name, updateValue);
                }
            });
        }
        return directive;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').service('skyformMethods', skyformMethods);
    function skyformMethods() {
        var _this = this;
        _this.addHover = function (element, wrap) {
            /* Hover methods*/
            element.on('mouseover', function () {
                wrap.addClass('hover');
            });
            element.on('mouseout', function () {
                wrap.removeClass('hover');
            });
        };
        _this.addFocus = function (element, wrap) {
            /* Focus methods*/
            element.on('focus', function () {
                wrap.addClass('focus');
            });
            element.on('blur', function () {
                wrap.removeClass('focus');
            });
        };
        _this.addActive = function (element, wrap) {
            /* control 'active'-class */
            element.on('mousedown', function () {
                wrap.addClass('active');
                angular.element(document).one('mouseup', function () {
                    wrap.removeClass('active');
                });
            });
        };
        _this.moveId = function (element, wrap) {
            /* should this be deprecated, since its only for uniform... */
            if (element.attr('id') && element != wrap) {
                wrap.attr('id', 'uniform-' + element.attr('id'));
            }
        };
        return this;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').service('skyformRadios', skyformRadios);
    function skyformRadios() {
        var _this = this;
        var radios = {};
        _this.add = function (name, fn) {
            if (!radios[name]) {
                radios[name] = [];
            }
            radios[name].push(fn);
        };
        _this.update = function (name) {
            angular.forEach(radios[name], function (updateFn) {
                // call with true, so it stops calling recursively
                updateFn(true);
            });
        };
        _this.remove = function (name, fn) {
            var index = -1;
            angular.forEach(radios[name], function (updateFn, key) {
                if (updateFn === fn) {
                    index = key;
                }
            });
            radios[name].splice(index, 1);
        };
        return this;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').directive('select', select);
    select.$inject = ['skyformMethods', 'skyformFields', '$timeout'];
    function select(skyformMethods, skyformFields, $timeout) {
        var directive = {
            restrict: 'E',
            link: link
        };
        function link(scope, element, attributes) {
            if (attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
                return false;
            }
            /* select[multiple] is not currently supported */
            if (attributes.multiple || attributes.multiple === "") {
                return false;
            }
            var wrap = element.wrap(angular.element('<div class="selector"></div>')).parent();
            var valueHolder = angular.element('<span></span>');
            wrap.append(valueHolder);
            var updateValue = function () {
                valueHolder.html(angular.element(element[0].querySelector(':checked')).html());
            };
            /* Set initial value in view after timeout, to fix an issue when options are passed via ngRepeat */
            $timeout(function () {
                updateValue();
            }, 0);
            /* Update value on model-changes (if angular-field) */
            scope.$watch(attributes.ngModel, function () {
                updateValue();
            });
            /* Update value on element-change */
            element.on('change', function () {
                updateValue();
            });
            /* Update value if the attribute updates in a $digest (e.g. value="{{something}}") */
            attributes.$observe('value', function () {
                updateValue();
            });
            skyformMethods.addHover(element, wrap);
            skyformMethods.addFocus(element, wrap);
            skyformMethods.moveId(element, wrap);
            /* SELECTS has no .active state */
            skyformFields.add(element[0], updateValue, wrap);
            scope.$on('$destroy', function () {
                skyformFields.remove(element[0]);
            });
        }
        return directive;
    }
})();
(function () {
    'use strict';
    angular.module('skyform').directive('textarea', textarea);
    textarea.$inject = ['skyformMethods', 'skyformFields'];
    function textarea(skyformMethods, skyformFields) {
        var directive = {
            restrict: 'E',
            link: link
        };
        function link(scope, element, attributes) {
            if (attributes.noUniform || attributes.noUniform === "" || attributes.noSkyform || attributes.noSkyform === "") {
                return false;
            }
            element.addClass('uniform');
            skyformMethods.addHover(element, element);
            skyformMethods.addFocus(element, element);
            skyformMethods.addActive(element, element);
            skyformFields.add(element[0], null, element);
            scope.$on('$destroy', function () {
                skyformFields.remove(element[0]);
            });
        }
        return directive;
    }
})();

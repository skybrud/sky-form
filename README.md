# skyform
Enhancing the styleability of form-fields with AngularJS.

## What is this
A set of services and element-directives that enhance form-elements for nicer styling, while keeping the native elements for accessibility. (made as an alternative to [jQuery Uniform](http://uniformjs.com/))

###Automatically updates the view when
 - the element onchange-event fires
 - the ngModel changes
 - the value-attribute is changed via data-binding

###Update the view manually by
 - broadcasting a 'skyform.update'-event on $rootScope
 - call the update(element)-method on the skyformFields-service
 - from outside angular by calling window.skyform.update(element) (element is optional. If no element is passed, all fields will be updated)

###How do I use it
Simply just load the module 'skyform' as a dependency to your angular.module and include some styling (roll your own or be inspired by uniformjs). 
Automatically does its magic when inside an ng-app because it consists of Element-directives. If adding fields from outside angular, you can call compile via skyform.add(element); (element is required!)
Disable by adding a no-skyform attribute to the field.

##Feel free to use and participate
Skyform is available for free under the GNU GPL license, which basically mean you can use it for free as long as you credit me. You can distribute and/or edit my work as long as you credit me and publish under the same license.

Issues and pull requests are appreciated. 

Filip Bruun Bech-Larsen, Skybrud.dk ([@filipbech](https://twitter.com/filipbech))
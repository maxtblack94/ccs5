angular.module('starter')



.directive('multiBg', function(){
	return {
		scope: {
			multiBg: '=',
			interval: '=',
			helperClass: '@'
		},
		controller: function($scope, $element, $attrs) {
			$scope.loaded = false;
			var utils = this;

			this.animateBg = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
					$element.css({'background-image': 'url(' + $scope.bg_img + ')'});
				});
			};

			this.setBackground = function(bg) {
				$scope.bg_img = bg;
			};

			if(!_.isUndefined($scope.multiBg))
			{
				if(_.isArray($scope.multiBg) && ($scope.multiBg.length > 1) && !_.isUndefined($scope.interval) && _.isNumber($scope.interval))
				{
					// Then we need to loop through the bg images
					utils.setBackground($scope.multiBg[0]);
				}
				else
				{
					// Then just set the multiBg image as background image
					utils.setBackground($scope.multiBg[0]);
				}
			}
		},
		templateUrl: 'templates/directives/multi-bg.html',
		restrict: 'A',
		replace: true,
		transclude: true
	};
})


.directive('bg', function() {
	return {
		restrict: 'A',
		require: '^multiBg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, multiBgController) {
			element.on('load', function() {
				multiBgController.animateBg();
		  });
		}
	};
})

.directive('preImg', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			ratio:'@',
			helperClass: '@'
		},
		controller: function($scope) {
			$scope.loaded = false;

			this.hideSpinner = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
				});
			};
		},
		templateUrl: 'templates/directives/pre-img.html'
	};
})

.directive('ionRadioFix', function() {
	return {
	  restrict: 'E',
	  replace: true,
	  require: '?ngModel',
	  transclude: true,
	  template:
	  ` 
	  <label class="item item-radio">
	  
		  <input type="radio" name="radio-group">
		  <div class="radio-content">
			<div class="item-content disable-pointer-events" ng-transclude></div>
			<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>
		  </div>
		</label>`,
  
	  compile: function(element, attr) {
		if (attr.icon) {
		  var iconElm = element.find('i');
		  iconElm.removeClass('ion-checkmark').addClass(attr.icon);
		}
  
		var input = element.find('input');
		angular.forEach({
			'name': attr.name,
			'value': attr.value,
			'disabled': attr.disabled,
			'ng-value': attr.ngValue,
			'ng-model': attr.ngModel,
			'ng-disabled': attr.ngDisabled,
			'ng-change': attr.ngChange,
			'ng-required': attr.ngRequired,
			'required': attr.required
		}, function(value, name) {
		  if (angular.isDefined(value)) {
			  input.attr(name, value);
			}
		});
  
		return function(scope, element, attr) {
		  scope.getValue = function() {
			return scope.ngValue || attr.value;
		  };
		};
	  }
	};
  })

.directive('spinnerOnLoad', function() {
	return {
		restrict: 'A',
		require: '^preImg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, preImgController) {
			element.on('load', function() {
				preImgController.hideSpinner();
		  });
		}
	};
})
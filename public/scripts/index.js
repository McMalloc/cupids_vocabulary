var OKC = angular.module('okcVis', [])
		.config([function () {
	}]).factory("frozen", ["$rootScope", function($rootScope) {
			var frozen = false;

			var freeze = function(data) {
				frozen = !frozen;
				if (frozen) {
					$rootScope.$broadcast("freeze!", data);
				} else {
					$rootScope.$broadcast("thaw!");
				}
			};

			var isFrozen = function() {
				return frozen;
			};

			return {
				isFrozen: isFrozen,
				freeze: freeze
			}
		}]);
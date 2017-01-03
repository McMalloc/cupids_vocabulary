OKC.directive("bargraph", ["$timeout", function ($timeout) {

	var controllerFn = function ($scope) {
		if ($scope.data === undefined) return;

		$scope.$on("redraw", function(event, data) {
			$timeout(function() {
				draw();
			});
		});

		var draw = function() {
			var max = _.max(_.flatten($scope.data));
			var n = $scope.data.length;
			$scope.style = [];
			_.each($scope.data, function(worddata, i) {
				var barHeight = worddata[1]/max * $scope.height;
				$scope.style[i] = {
					height: barHeight + "px",
					width: Math.floor(100/n) + "%",
					marginTop: $scope.height - barHeight + "px"
				}
			});
		};

		draw();
	};

	return {
		restrict: 'AE',
		scope: {
			data: '=bgdata',
			height: '=bgheight'
		},
		replace: 'true',
		templateUrl: 'directives/bargraph.html',
		controller: controllerFn
	};

}]);
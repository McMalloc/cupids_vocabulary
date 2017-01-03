OKC.controller("mainController",
		["$scope", "$http", function ($scope, $http) {

			var updateGraphs = function (res) {
				$scope.$broadcast("redraw", res.data);
			};

			var baseHeight = 100;

			$scope.$on("featureupdate", function(event, data) {
				$scope.wantedFeatures = data;
				getData();
			});

			$scope.$on("numberupdate", function(event, data) {
				$scope.wantedNumber = data;
				getData();
			});

			$scope.$on("essayupdate", function(event, args) {
				$scope.wantedEssays = [];
				_.each(args, function(essay) {
					if (essay.visible) $scope.wantedEssays.push(essay.id);
				});
				getData();
			});

			$scope.wantedEssays = [];
			$scope.wantedFeatures = [];
			$scope.wantedNumber = 3;

			var getData = function() {
				$http({
					method: "POST",
					url: "/counts",
					data: JSON.stringify({
							number: $scope.wantedNumber,
							essays: $scope.wantedEssays,
							features: $scope.wantedFeatures
						}),
					dataType: "json",
					contentType: 'application/json'
				}).then(updateGraphs);
			};
}]);
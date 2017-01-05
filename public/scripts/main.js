OKC.controller("mainController",
		["$scope", "$http", function ($scope, $http) {

			var updateGraphs = function (res) {
				$scope.$broadcast("redraw", res.data);
				$scope.loading = false;
			};

			$scope.loading = false;

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

			$scope.showTutorial = localStorage.getItem("showTut") === null;

			$scope.hideTutorial = function() {
				$scope.showTutorial = false;
				localStorage.setItem("showTut", false);
			};

			var getData = function() {
				$scope.loading = true;
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
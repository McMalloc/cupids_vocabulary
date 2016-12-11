OKC.controller("mainController",
		["$scope", "$http", function ($scope, $http) {

			var updateGraphs = function (res) {
				$scope.$broadcast("newdate", res.data);
			};

			var baseHeight = 100;

			$scope.$on("getdata", function(params) {
				$http({
					type: "POST",
					url: "/counts",
					data: JSON.stringify({
						number: 3,
						features: JSON.stringify(params),
						essays: [0,1,2,3,4,5,6,7,8,9]
					}),
					dataType: "json",
					contentType: 'application/json'
				}).then(updateGraphs);
			});
}]);
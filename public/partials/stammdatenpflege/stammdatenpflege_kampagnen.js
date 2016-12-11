MAS.controller('stammdatenpflegeKampagnenController', ['$scope', 'stammdaten', '$timeout', 'preferences', 'notification', '$filter',
	function ($scope, stammdaten, $timeout, prefs, notification, $filter) {

		stammdaten.getKampagnenListe().then(function(res) {
			$scope.listboxSource = res;
		});

		$scope.listboxSettings = {
			width: "90%",
			searchMode: "containsignorecase",
			height: "100%",
			valueMember: "id",
			displayMember: "name",
			bindingComplete: function(widget) {
				//$timeout(function() {
				//	$scope.listboxSettings.apply("selectIndex", 0);
				//}, 100);
			}
		};

		$scope.model = {};
		$scope.modelBackup = {};

		$scope.showKampagne = function(event) {
			$scope.model = {};
			$scope.modelBackup = {};
			$scope.model = angular.copy(stammdaten.getKampagneById(event.args.item.value));
			$scope.modelBackup = angular.copy(stammdaten.getKampagneById(event.args.item.value));
		};

		var saveSuccess = function(index, formRef) {
			return function(res) {
				if (parseInt(res.data.fehler) > 0) {
					notification.show({
						template: "error",
						message: $filter("translate")("Stammdaten.Speicherfehler") + "<br />" + res.data.fehlerMeldung + "<br />" + res.data.ExceptionMessageInner
					});
				} else {
					formRef.$setPristine();
					$scope.listboxSettings.apply("render");
					notification.show({
						template: "success",
						message: $filter("translate")("Stammdaten.Speichererfolg")
					});
				}
			}
		};

		var saveFailure = function(res) {
			console.error("flop!", res);
		};

		$scope.cancelEditing = function() {
			$scope.model = angular.copy(stammdaten.getWerkstoffById($scope.model.id));
		};

		$scope.saveForm = function() {
			if ($scope.stammdatenpflegeKampagne.kampagneform.$invalid) return;
			$scope.modelBackup = angular.copy($scope.model);
			stammdaten.saveKampagne($scope.model).then(saveSuccess(null, $scope.stammdatenpflegeKampagne.kampagneform), saveFailure);
		};
	}]);

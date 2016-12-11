MAS.controller('stammdatenpflegeAnlagenController', ['$scope', 'stammdaten', '$timeout', 'preferences', '$filter', 'notification',
    function ($scope, stammdaten, $timeout, prefs, $filter, notification) {

        $scope.anlagen = [];
        $scope.treeSettings = {
            width: "100%",
            height: "100%"
        };

        $scope.templateFlags = {
            anlage:         false,
            ofen:           false,
            stillstandzeit: false
        };

        $scope.dateTimeSettings = {
            formatString: "dd.MM.yyyy HH:mm",
            showTimeButton: true
        };

        $scope.stillstandszeitenForms = [];

        $scope.model = {};
        $scope.backupModel = {};

        $scope.setEndTime = function(event) {
            var index = event.currentTarget.dataset.index;
            $("#stillstandszeit-ende-input-" + index).jqxDateTimeInput("setDate", event.args.date);
        };

        var switchTemplateFlag = function(templateName) {
            $scope.templateFlags = _.mapObject($scope.templateFlags, function(value, key) {
                return key === templateName;
            });
        };

        var getTemplateFlag = function() {
            var flag = "";
            _.each(_.keys($scope.templateFlags), function(key) {
                if ($scope.templateFlags[key]) flag = key;
            });
            return flag;
        };

        stammdaten.getAnlagenListe().then(function(res) {
           $scope.anlagen = res.anlagen;
            $scope.showAnlage($scope.anlagen[0].id);
        });

        $scope.showAnlage = function(id) {
            switchTemplateFlag("anlage");
            $scope.model = {};
            $scope.modelBackup = {};
            $scope.model = stammdaten.getAnlageById(id);
            $scope.modelBackup = angular.copy(stammdaten.getAnlageById(id));
        };

        $scope.showOfen = function(id) {
            console.dir($scope);
            switchTemplateFlag("ofen");
            $scope.model = {};
            $scope.modelBackup = {};
            $scope.model = angular.copy(stammdaten.getOfenById(id));
            $scope.modelBackup = angular.copy(stammdaten.getOfenById(id));
        };

        var saveSuccess = function(index, formRef) {
            return function(res) {
                if (parseInt(res.data.fehler) > 0) {
                    notification.show({
                        template: "error",
                        message: $filter("translate")("Stammdaten.Speicherfehler") + "<br />" + res.data.fehlerMeldung + "<br />" + res.data.ExceptionMessageInner
                    });
                } else {
                    if (index != null) {
                        $scope.model.ofenStillstandsZeiten[index].id = res.data.id;
                    }
                    formRef.$setPristine();
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

        $scope.cancelOfenEditing = function() {
            $scope.model = angular.copy(stammdaten.getOfenById($scope.model.id));
            $scope.stammdatenpflegeAnlagen.ofenForm.$setPristine();
        };

        $scope.cancelAnlageEditing = function() {
            $scope.model = angular.copy(stammdaten.getAnlageById($scope.model.id));
            $scope.stammdatenpflegeAnlagen.anlagenForm.$setPristine();
        };

        $scope.addStillstandszeit = function() {
            $scope.model.ofenStillstandsZeiten.push({
                aktiv: 1,
                id: 0,
                //beginnSettings: Object.create()
                ofen_id: $scope.model.id
            });
            // set dirty after scope is finished processing
            $timeout(function() {
                $scope.model.ofenStillstandsZeiten[$scope.model.ofenStillstandsZeiten.length-1].form.$setDirty();
            });
        };

        $scope.removeStillstandszeit = function(index) {
            if ($scope.model.ofenStillstandsZeiten[index].id === 0) {
                $scope.model.ofenStillstandsZeiten.splice(index, 1);
            } else {
                $scope.model.ofenStillstandsZeiten[index] = $scope.modelBackup.ofenStillstandsZeiten[index];
                if ($scope.model.ofenStillstandsZeiten[index].form) {
                    $scope.model.ofenStillstandsZeiten[index].form.$setPristine();
                }
            }
        };

        $scope.saveStillstandszeit = function(index) {
            if ($scope.model.ofenStillstandsZeiten[index].form.$invalid) return;
            $scope.modelBackup = angular.copy($scope.model);
            //$scope.model.ofenStillstandsZeiten[$scope.model.ofenStillstandsZeiten.length-1].form.$setPristine();
            stammdaten.saveStillstandszeit($scope.model.ofenStillstandsZeiten[index]).then(saveSuccess(index, $scope.model.ofenStillstandsZeiten[index].form), saveFailure);
        };

        $scope.saveForm = function() {
            var template = getTemplateFlag();
            switch (template) {
                case "anlage":
                    stammdaten.saveAnlage($scope.model).then(saveSuccess(null, $scope.stammdatenpflegeAnlagen.anlagenForm), saveFailure);
                    break;
                case "ofen":
                    stammdaten.saveOfen($scope.model).then(saveSuccess(null, $scope.stammdatenpflegeAnlagen.ofenForm), saveFailure);
                    break;
                default:
                    break;
            }
        };


}]);

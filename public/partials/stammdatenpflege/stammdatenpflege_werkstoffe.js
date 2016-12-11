MAS.controller('stammdatenpflegeWerkstoffeController', ['$scope', 'stammdaten', '$timeout', 'preferences', 'notification', '$filter',
    function ($scope, stammdaten, $timeout, prefs, notification, $filter) {

        stammdaten.getWerkstoffListe().then(function(res) {
            $scope.listboxSource =  res.werkstoffe;
        });

        stammdaten.getKampagnenListe().then(function(res) {
            $scope.kampagnen = res;
        });

        $scope.listboxSettings = {
            width: "90%",
            searchMode: "containsignorecase",
            height: "100%",
            displayMember: "id",
            valueMember: "wkst_nr",
            renderer: function(index, label, value) {
                return value + ", " + $scope.listboxSource[index].empfaenger;
            },
            bindingComplete: function(widget) {
                //$timeout(function() {
                    //$scope.listboxSettings.apply("selectIndex", 0);
                //}, 100);
            }
        };

        $scope.kampagnenComboboxSettings = {
            width: "100%",
            valueMember: "id",
            displayMember: "name"
        };

        $scope.comboboxSettings = {
            width: 60,
            valueMember: "name",
            displayMember: "id"
        };

        $scope.dateTimeSettings = {
            formatString: "dd.MM.yyyy",
            width: 100,
            culture: prefs.getLocale(),
            enableBrowserBoundsDetection: true
        };

        stammdaten.getAnlagenListe().then(function(res) {
            $scope.anlagen = res.anlagen;
        });

        $scope.model = {};
        $scope.modelBackup = {};
        $scope.lastindex = 0;

        $scope.showWerkstoff = function(event) {
            $scope.index = event.index;
            console.dir(event.args);
            $scope.model = {};
            $scope.modelBackup = {};
            $scope.model = angular.copy(stammdaten.getWerkstoffById(event.args.item.label));
            $scope.modelBackup = angular.copy(stammdaten.getWerkstoffById(event.args.item.label));
        };

        var saveSuccess = function(index, formRef) {
            return function(res) {
                if (parseInt(res.data.fehler) > 0) {
                    notification.show({
                        template: "error",
                        message: $filter("translate")("Stammdaten.Speicherfehler") + "<br />" + res.data.fehlerMeldung + "<br />" + res.data.ExceptionMessageInner
                    });
                } else {
                    if (index != null) { //anlagenListe
                        $scope.model.werkstoffAnlageListe[index].id = res.data.id;
                    }
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

        $scope.addAnlage = function() {
            $scope.model.werkstoffAnlageListe.push({
                bemerkung: "",
                id: 0,
                wkst_id: $scope.model.id
            });
            // set dirty after scope is finished processing
            $timeout(function() {
                $scope.model.werkstoffAnlageListe[$scope.model.werkstoffAnlageListe.length-1].form.$setDirty();
            });
        };

        $scope.removeWerkstoffAnlageListe = function(index) {
            if ($scope.model.werkstoffAnlageListe[index].id === 0) {
                $scope.model.werkstoffAnlageListe.splice(index, 1);
            } else {
                $scope.model.werkstoffAnlageListe[index] = $scope.modelBackup.werkstoffAnlageListe[index];
                if ($scope.model.werkstoffAnlageListe[index].form) {
                    $scope.model.werkstoffAnlageListe[index].form.$setPristine();
                }
            }
        };

        $scope.saveWerkstoffAnlageListe = function(index) {
            if ($scope.model.werkstoffAnlageListe[index].form.$invalid) return;
            $scope.modelBackup = angular.copy($scope.model);
            $scope.model.werkstoffAnlageListe[$scope.model.werkstoffAnlageListe.length-1].form.$setPristine();
            stammdaten.saveWerkstoffAnlage($scope.model.werkstoffAnlageListe[index]).then(saveSuccess(index, $scope.model.werkstoffAnlageListe[index].form), saveFailure);
        };

        $scope.saveForm = function() {
            if ($scope.stammdatenpflegeWerkstoffe.werkstoffform.$invalid) return;
            $scope.modelBackup = angular.copy($scope.model);
            stammdaten.saveWerkstoff($scope.model).then(saveSuccess(null, $scope.stammdatenpflegeWerkstoffe.werkstoffform), saveFailure);
        };


}]);

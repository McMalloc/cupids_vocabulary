MAS.controller('stammdatenpflegeController', ['$scope', '$routeParams', '$location',
    function ($scope, $routeParams, $location) {

        $scope.showAnlagenDatenblatt = false;
        $scope.showWerkstoffDatenblatt = false;
        $scope.showKampagnenDatenblatt = false;

        $scope.tabSettings = {
            width: "100%",
            height: "100%"
        };

        $scope.initTabs = function() {
            switch ($routeParams.partial) {
                case "werkstoffe":
                    $scope.tabSettings.apply("select", 1);
                    $scope.showWerkstoffDatenblatt = true;
                    break;
                case "anlagen":
                    $scope.tabSettings.apply("select", 0);
                    $scope.showAnlagenDatenblatt = true;
                    break;
                case "kampagnen":
                    $scope.tabSettings.apply("select", 2);
                    $scope.showKampagnenDatenblatt = true;
                    break;
                default:
                    // first tab will be automatically selected by the widget
                    $scope.showAnlagenDatenblatt = true;
                    break;
            }
        };

        $scope.tabSelected = function(event) {
            if (event.args.item === 1) {
                $scope.showWerkstoffDatenblatt = true;
                $location.path("stammdaten/werkstoffe");
            } else if (event.args.item === 0) {
                $scope.showAnlagenDatenblatt = true;
                $location.path("stammdaten/anlagen");
            }else if (event.args.item === 2) {
                $scope.showKampagnenDatenblatt = true;
                $location.path("stammdaten/kampagnen");
            }
        }

}]);

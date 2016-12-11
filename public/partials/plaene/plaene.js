MAS.controller('plaeneController', ['$scope', '$filter', 'localization', 'cache', '$location', '$q',
	function ($scope, $filter, localization, cache, $location, $q) {

		$scope.empty = _.isEmpty;

		$scope.editButton = {
			width: 120
		};
		$scope.duplicateButton = {
			width: 120
		};
		$scope.viewButton = {
			width: 120
		};

		$scope.newButton = {
			width: 120
		};

		$scope.panelSettings = {
			width: "100%",
			height: 300,
			autoUpdate: true
		};

		$scope.gridSettings = {
			width: "100%",
			height: 300,
			altrows: true,
			sortable: true,
			autoshowfiltericon: true,
			columnsresize: true,
			columnsreorder: false,
			selectionmode: 'single',
			localization: localization.get(),
			groupable: false,
			filterable: true,
			showfilterrow: true,
			enabletooltips: true,
			autoshowloadelement: true,
			columnsautoresize: true
		};

		$scope.datafields = [
			{ name: 'id', type: "number" },
			{ name: 'status', type: "string" },
			{ name: 'name', type: "string" },
			{ name: 'status_id', type: "number" },
			{ name: 'user_lastedit', type: "string" },
			{ name: 'lastedit', type: "date" },
			{ name: 'bemerkungen', type: "array" }
		];

		$scope.gridColumns = [
			{
				text: $filter('translate')('Plaene.id'),
				datafield: 'id',
				width: "5%",
				hidden: false
			}, {
				text: $filter('translate')('Plaene.Bezeichnung'),
				datafield: 'name',
				width: "45%",
				minwidth: 60,
				hidden: false
			}, {
				text: $filter('translate')('Plaene.Status'),
				datafield: 'status_id',
				width: "10%",
				hidden: false,
				cellsrenderer: function(row, datafield, value, html) {
					var $html = $(html);
				    $html.text($filter("translate")("Plaene.Status" + value));
					$html.addClass("gridcell-alias-" + value);
					return $html[0].outerHTML;
				}
			}, {
				text: $filter('translate')('Plaene.Besitzer'),
				datafield: 'user_lastedit',
				width: "20%",
				minwidth: 60,
				hidden: false
			}, {
			    text: $filter('translate')('Plaene.lastedit'),
			    datafield: 'lastedit',
			    width: "20%",
			    columntype: 'datetimeinput',
			    cellsformat: 'dd.MM.yyyy HH:mm',
			    minwidth: 60,
			    hidden: false
			}
		];

		$scope.selectedPlan = {};
		$scope.gridSource = [];

		var plaeneGridDeferred = $q.defer();
		var plaeneGridPromise = plaeneGridDeferred.promise;

		$scope.$on("jqxGridCreated", function() {
			plaeneGridDeferred.resolve("ok");
		});

		cache.getPlanListe(false).then(function(res) {
			var plaeneSource = {
				datatype: "array",
				localdata: res.planListe,
				datafields: $scope.datafields
			};

			var plaeneDataAdapter = new $.jqx.dataAdapter(plaeneSource,
				{
					autoBind: true
				});

			plaeneGridPromise.then(function() {
				$scope.gridSource = plaeneDataAdapter;
			});
		});

		$scope.planSelected = function(event) {
			// befülle selected Plan
			$scope.selectedPlan = event.args.row.bounddata;
		};

		$scope.archiveChanged = function(event) {
			// sende erneute Anfrage
			cache.getPlanListe(event.args.checked).then(function(res) {
				var plaeneSource = {
					datatype: "array",
					localdata: res.planListe,
					datafields: $scope.datafields
				};

				var plaeneDataAdapter = new $.jqx.dataAdapter(plaeneSource,
					{
						autoBind: true
					});

				$scope.gridSource = plaeneDataAdapter;
			});
		};

		$scope.view = function(event) {
			$location.path("/grobplan/" + $scope.selectedPlan.id);
			$location.search("edit", "false");
		};

		$scope.edit = function(event) {
			$location.path("/grobplan/" + $scope.selectedPlan.id);
			$location.search("edit", "true");
		};

		$scope.duplicate = function(event) {
			// sende erneute Anfrage
			console.dir(event);
		};

		$scope.new = function(event) {
			$location.path("/grobplan/0");
			$location.search("edit", "true");
		}

	}]);
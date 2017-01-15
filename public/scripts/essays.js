OKC.controller("essaysController",
	["$scope", "frozen", function ($scope, frozen) {

		var vm = this;
		vm.essays = [
			{
				name: "Self-Summary",
				id: 0,
				visible: false
			},
			{
				name: "What I'm Doing With My Life",
				id: 1,
				visible: false
			},
			{
				name: "I'm Really Good At",
				id: 2,
				visible: false
			},
			{
				name: "The First Things People Notice",
				id: 3,
				visible: false
			},
			{
				name: "Favorite Movies/Books/Etc.",
				id: 4,
				visible: false
			},
			{
				name: "Six Things",
				id: 5,
				visible: false
			},
			{
				name: "I Spend A Lot Of Time Thinking About",
				id: 6,
				visible: false
			},
			{
				name: "Typical Friday Night",
				id: 7,
				visible: false
			},
			{
				name: "Most Private Thing I'm Willing To Admit",
				id: 8,
				visible: false
			},
			{
				name: "Message Me If",
				id: 9,
				visible: false
			}
		];
		vm.data = [];
		vm.frozen = false;

		$scope.$on("redraw", function(event, data) {
			vm.data = data;
		});

		$scope.$on("freeze!", function() {
			vm.frozenData = _.clone(vm.data);
			vm.frozen = true;
		});

		$scope.$on("thaw!", function() {
			vm.frozen = false;
		});

		vm.updateData = function() {
			$scope.$emit("essayupdate", vm.essays);
		};
		vm.updateNumber = function() {
			console.log("number blur");
			$scope.$emit("numberupdate", vm.number)
		};
		vm.baseHeight = 100;
		vm.number = 3;

		vm.removeEssay = function(id) {
			_.find(vm.essays, {id: id}).visible = false;
		};

	}]);

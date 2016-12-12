OKC.controller("essaysController",
	["$scope", function ($scope) {

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

		$scope.$on("redraw", function(event, data) {
			console.log("redraw");
			vm.data = data;
		});

		vm.updateData = function() {
			$scope.$emit("essayupdate", vm.essays);
		};
		vm.updateNumber = function() {
			$scope.$emit("numberupdate", vm.number)
		};
		vm.baseHeight = 100;
		vm.number = 3;

		vm.removeEssay = function(id) {
			_.find(vm.essays, {id: id}).visible = false;
		};

	}]);

var json = {"essay1":[["work",252],["working",242],["trying",178]]};

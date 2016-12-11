OKC.controller("featuresController",
	["$scope", function ($scope) {

		var vm = this;

		$scope.$emit("getdata", vm.features);

		vm.features = [
			{
				name: "age",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "body_type",
				options: ["average", "a little bit more", ""],
				visible: false, selected: ""
			},
			{
				name: "diet",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "drinks",
				options: ["often", "never", ""],
				visible: false, selected: ""
			},
			{
				name: "drugs",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "education",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "ethnicity",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "height",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "income",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "job",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "location",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "offspring",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "orientation",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "pets",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "religion",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "sex",
				options: ["m", "f"],
				visible: false, selected: ""
			},
			{
				name: "sign",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "smokes",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "speaks",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "status",
				options: [],
				visible: false, selected: ""
			}];

	}]);

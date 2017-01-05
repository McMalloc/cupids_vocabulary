OKC.controller("featuresController",
	["$scope", function ($scope) {

		var vm = this;

		//$scope.$emit("getdata", vm.features);

		var updateFeatures = function() {
			var selectedFeatures = {};
			_.each(_.filter(vm.features, "visible"), function(f) {
				if (f.selected === "(no answer)") {
					selectedFeatures[f.name] = "";
				} else {
					selectedFeatures[f.name] = f.selected;
				}
			});
			$scope.$emit("featureupdate", selectedFeatures)
		};

		$scope.$watch("features", function() {
			updateFeatures();
		}, true);

		vm.removeFeature = function(name) {
			_.find(vm.features, {name: name}).visible = false;
		};

		vm.features = [
			//{
			//	name: "age",
			//	options: [
			//			"<18",
			//			"<25",
			//			"<35",
			//			"<45",
			//			"<60",
			//			"60+"
			//	],
			//	visible: false, selected: ""
			//},
			{
				name: "body_type",
				options: [
					"average",
					"a little bit more",
					"thin",
					"fit",
					"skinny",
					"overweight",
					"curvy",
					"athletic",
					"full figured"
				],
				visible: false, selected: ""
			},
			{
				name: "diet",
				options: [
					"strictly anything",
					"mostly other",
					"anything",
					"vegetarian",
					"mostly anything",
					"mostly vegetarian",
					"strictly vegan",
					"strictly vegetarian",
					"mostly vegan",
					"strictly other",
					"mostly halal",
					"other",
					"vegan",
					"mostly kosher",
					"strictly halal",
					"halal",
					"strictly kosher",
					"kosher"
				],
				visible: false, selected: ""
			},
			{
				name: "drinks",
				options: [
					"socially",
					"often",
					"not at all",
					"rarely",
					"very often",
					"desperately"

				],
				visible: false, selected: ""
			},
			{
				name: "drugs",
				options: [
					"never",
					"sometimes",
					"often"
				],
				visible: false, selected: ""
			},
			{
				name: "education",
				options: [
					"working on college/university",
					"working on space camp",
					"graduated from masters program",
					"graduated from college/university",
					"working on two-year college",
					"graduated from high school",
					"working on masters program",
					"graduated from space camp",
					"college/university",
					"dropped out of space camp",
					"graduated from ph.d program",
					"graduated from law school",
					"working on ph.d program",
					"two-year college",
					"graduated from two-year college",
					"working on med school",
					"dropped out of college/university",
					"space camp",
					"graduated from med school",
					"dropped out of high school",
					"working on high school",
					"masters program",
					"dropped out of ph.d program",
					"dropped out of two-year college",
					"dropped out of med school",
					"high school",
					"working on law school",
					"law school",
					"dropped out of masters program",
					"ph.d program",
					"dropped out of law school",
					"med school"
				],
				visible: false, selected: ""
			},
			{
				name: "ethnicity",
				options: [
						"white",
						"asian",
						"other",
						"hispanic / latin",
						"black",
						"middle eastern",
						"pacific islander",
						"native american",
						"indian"
				],
				visible: false, selected: ""
			},
			{
				name: "height",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "income",
				options: [
					"-1",
					"20000",
					"30000",
					"40000",
					"50000",
					"60000",
					"70000",
					"80000",
					"100000",
					"150000",
					"250000",
					"500000",
					"1000000"
				],
				visible: false, selected: ""
			},
			{
				name: "job",
				options: [
					"transportation",
					"hospitality / travel",
					"student",
					"artistic / musical / writer",
					"computer / hardware / software",
					"banking / financial / real estate",
					"entertainment / media",
					"sales / marketing / biz dev",
					"other",
					"medicine / health",
					"science / tech / engineering",
					"executive / management",
					"education / academia",
					"clerical / administrative",
					"construction / craftsmanship",
					"rather not say",
					"political / government",
					"law / legal services",
					"unemployed",
					"military",
					"retired"
				],
				visible: false, selected: ""
			},
			{
				name: "location",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "offspring",
				options: [
					"doesn't have kids",
					"doesn't have kids, and doesn't want any",
					"doesn't have kids, but might want them",
					"doesn't have kids, but wants them",
					"doesn't want kids",
					"has a kid",
					"has a kid, and might want more",
					"has a kid, and wants more",
					"has a kid, but doesn't want more",
					"has kids",
					"has kids, and might want more",
					"has kids, and wants more",
					"has kids, but doesn't want more",
					"might want kids",
					"wants kids"
				],
				visible: false, selected: ""
			},
			{
				name: "orientation",
				options: [
					"straight",
					"bisexual",
					"gay"
				],
				visible: false, selected: ""
			},
			{
				name: "pets",
				options: [
					"dislikes cats",
					"dislikes dogs",
					"dislikes dogs and dislikes cats",
					"dislikes dogs and has cats",
					"dislikes dogs and likes cats",
					"has cats",
					"has dogs",
					"has dogs and dislikes cats",
					"has dogs and has cats",
					"has dogs and likes cats",
					"likes cats",
					"likes dogs",
					"likes dogs and dislikes cats",
					"likes dogs and has cats",
					"likes dogs and likes cats"
				],
				visible: false, selected: ""
			},
			{
				name: "religion",
				options: [
					"agnosticism",
					"agnosticism and laughing about it",
					"agnosticism and somewhat serious about it",
					"agnosticism and very serious about it",
					"agnosticism but not too serious about it",
					"atheism",
					"atheism and laughing about it",
					"atheism and somewhat serious about it",
					"atheism and very serious about it",
					"atheism but not too serious about it",
					"buddhism",
					"buddhism and laughing about it",
					"buddhism and somewhat serious about it",
					"buddhism and very serious about it",
					"buddhism but not too serious about it",
					"catholicism",
					"catholicism and laughing about it",
					"catholicism and somewhat serious about it",
					"catholicism and very serious about it",
					"catholicism but not too serious about it",
					"christianity",
					"christianity and laughing about it",
					"christianity and somewhat serious about it",
					"christianity and very serious about it",
					"christianity but not too serious about it",
					"hinduism",
					"hinduism and laughing about it",
					"hinduism and somewhat serious about it",
					"hinduism and very serious about it",
					"hinduism but not too serious about it",
					"islam",
					"islam and laughing about it",
					"islam and somewhat serious about it",
					"islam and very serious about it",
					"islam but not too serious about it",
					"judaism",
					"judaism and laughing about it",
					"judaism and somewhat serious about it",
					"judaism and very serious about it",
					"judaism but not too serious about it",
					"other",
					"other and laughing about it",
					"other and somewhat serious about it",
					"other and very serious about it",
					"other but not too serious about it"
				],
				visible: false, selected: ""
			},
			{
				name: "sex",
				options: ["m", "f"],
				visible: false, selected: ""
			},
			{
				name: "sign",
				options: [
					"aquarius",
					"aquarius and it matters a lot",
					"aquarius and it's fun to think about",
					"aquarius but it doesn't matter",
					"aries",
					"aries and it matters a lot",
					"aries and it's fun to think about",
					"aries but it doesn't matter",
					"cancer",
					"cancer and it matters a lot",
					"cancer and it's fun to think about",
					"cancer but it doesn't matter",
					"capricorn",
					"capricorn and it matters a lot",
					"capricorn and it's fun to think about",
					"capricorn but it doesn't matter",
					"gemini",
					"gemini and it matters a lot",
					"gemini and it's fun to think about",
					"gemini but it doesn't matter",
					"leo",
					"leo and it matters a lot",
					"leo and it's fun to think about",
					"leo but it doesn't matter",
					"libra",
					"libra and it matters a lot",
					"libra and it's fun to think about",
					"libra but it doesn't matter",
					"pisces",
					"pisces and it matters a lot",
					"pisces and it's fun to think about",
					"pisces but it doesn't matter",
					"sagittarius",
					"sagittarius and it matters a lot",
					"sagittarius and it's fun to think about",
					"sagittarius but it doesn't matter",
					"scorpio",
					"scorpio and it matters a lot",
					"scorpio and it's fun to think about",
					"scorpio but it doesn't matter",
					"taurus",
					"taurus and it matters a lot",
					"taurus and it's fun to think about",
					"taurus but it doesn't matter",
					"virgo",
					"virgo and it matters a lot",
					"virgo and it's fun to think about",
					"virgo but it doesn't matter"
				],
				visible: false, selected: ""
			},
			{
				name: "smokes",
				options: [
					"no",
					"sometimes",
					"trying to quit",
					"when drinking",
					"yes"
				],
				visible: false, selected: ""
			},
			{
				name: "speaks",
				options: [],
				visible: false, selected: ""
			},
			{
				name: "status",
				options: [
					"available",
					"married",
					"seeing someone",
					"single",
					"unknown"
				],
				visible: false, selected: ""
			}];

	}]);

OKC.directive("bargraph", function () {

	return {
		restrict: 'AE',
		scope: {
			data: '=bgdata',
			height: '=bgheight'
		},
		replace: 'true',
		templateUrl: 'directives/bargraph.html',
		link: function(scope) {
			if (scope.data === undefined) return;
			var max = _.max(_.flatten(scope.data));
			var n = scope.data.length;
			scope.style = [];
			console.dir(scope.data);
			_.each(scope.data, function(worddata, i) {
				var barHeight = worddata[1]/max * scope.height;
				scope.style[i] = {
					height: barHeight + "px",
					width: Math.floor(100/n) + "%",
					marginTop: scope.height - barHeight + "px"
				}
			});
		}
	};

});
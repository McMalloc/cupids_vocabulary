var OKC = angular.module('okcVis', [])
		.config([function () {

	}]);

// hacky multiselect
$("select[multiple] option").mousedown(function(){
	var $self = $(this);

	if ($self.prop("selected"))
		$self.prop("selected", false);
	else
		$self.prop("selected", true);

	return false;
});
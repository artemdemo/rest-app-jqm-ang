restApp

.directive('menuItemPage', function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-pages/menuItemPage.html',
		controller: function() {
			$('#menuItemPage').page();
		}
	}
})
var restApp = angular.module( 'restApp', [] )

.factory('menuFactory', ['$http', '$q', function( $http, $q ){
	var menuApiURL = "menu.json";

	return {
		getMenu: function() {
			var deferred = $q.defer();
			
			$http({method: 'GET', url: menuApiURL}).
				success(function(data, status, headers, config) {
					deferred.resolve( data );
				}).
				error(function(data, status, headers, config) {
					deferred.reject( 'Error in $http request' );
					console.log( data );
					console.log( status );
				});
			return deferred.promise;
		}
	}
}])

.controller( 'mainCtrl', [ '$scope', '$timeout', function( $scope, $timeout ){
	
}])

.controller( 'menuListCtrl', [ '$scope', '$timeout', 'menuFactory', function( $scope, $timeout, menuFactory ){
	
	menuFactory.getMenu().then(function( menuObj ){
		$scope.products = menuObj.products;
	});

	$scope.openItem = function() {
		console.log( 'open item' );
	}

	$( '#menuList li' ).on('tap', function(){
		console.log( 'menu item' );
		$.mobile.changePage('#menuItemPage', {transition: "slideup"} );
	})

}]);


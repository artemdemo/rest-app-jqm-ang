var restApp = angular.module( 'restApp', [] )

.factory('menuFactory', ['$http', '$q', function( $http, $q ){
	var menuApiURL = "menu.json";

	var menu = null;
	var currency = '$';

	var currentItem = null;
	var currentItemStatus = 'new'; // new OR edit
	var currentAmount = 1;
	var currentModifiers = [];

	return {
		getMenu: function() {
			var deferred = $q.defer();
			
			$http({method: 'GET', url: menuApiURL}).
				success(function(data, status, headers, config) {
					menu = data;
					currency = data.currency;
					deferred.resolve( data );
				}).
				error(function(data, status, headers, config) {
					deferred.reject( 'Error in $http request' );
					console.log( data );
					console.log( status );
				});
			return deferred.promise;
		},

		setCurrentItem: function( item ) {
			currentItem = item;
		},

		setCurrentItemById: function( id ) {
			for (var i=0; i < menu.products.length; i++){
				if ( menu.products[i].id == id ) {
					currentItem = menu.products[i];
					return true;
				}
			}
			return false;
		},

		getCurrentItem: function() {
			return currentItem;
		},

		getCurrency: function() {
			return currency;
		},

		getCurrentAmount: function() {
			return currentAmount;
		},

		setCurrentAmount: function( newAmount ) {
			currentAmount = newAmount;
		},

		getCurrentItemStatus: function() {
			return currentItemStatus;
		},

		setCurrentItemStatus: function( status ) {
			currentItemStatus = status;
		},

		setCurrentModifiers: function( newModifiers ) {
			currentModifiers = newModifiers;
		},

		getCurrentModifiers: function() {
			return currentModifiers;
		}
	}
}])

/************************************************************
 * Cart service
 * Will hold data about items in cart
 */
.factory('cartFactory', [function(){
	var cart = [];

	return {
		getCartCount: function(){
			return cart.length;
		},

		addItemToCart: function( item, amount, modifiers ){
			var newItem = {};
			newItem.modifiers = [];
			newItem.id = item.id;
			newItem.name = item.name;
			newItem.price = item.price;
			newItem.amount = amount;
			if ( !! modifiers && modifiers.length > 0 ) {
				newItem.modifiers = modifiers;
			}
			cart.push( newItem );
		},

		getCart: function(){
			return cart;
		},

		getTotal: function(){
			var total = 0;

			if ( cart.length > 0 )
				for ( var i=0; i < cart.length; i++ ){
					total += cart[i].price * cart[i].amount;
					if ( cart[i].modifiers.length > 0 )
						for( var j=0; j < cart[i].modifiers.length; j++ ){
							total += cart[i].modifiers[j].price * cart[i].amount;
						}
				}

			return total.toFixed(2);
		},

		removeItem: function( item ) {
			var id = item.id;
			for (var i=0; i < cart.length; i++){
				if ( cart[i].id == id ) {
					cart.splice(i, 1);
					return true;
				}
			}
			return false;
		}
	}
}])

/************************************************************
 * Main controller of whole app
 */
.controller( 'mainCtrl', [ '$scope', '$timeout', function( $scope, $timeout ){
	
}])

/************************************************************
 * Controller of the first page - menu list
 */
.controller( 'menuListCtrl', [ '$scope', '$rootScope', '$timeout', 'menuFactory', function( $scope, $rootScope, $timeout, menuFactory ){
	
	menuFactory.getMenu().then(function( menuObj ){
		$scope.currency = menuObj.currency;
		$scope.products = menuObj.products;
	});

	$scope.openItem = function( item ) {
		menuFactory.setCurrentItem( item );
		menuFactory.setCurrentItemStatus( 'new' );
		menuFactory.setCurrentAmount( 1 );
		// broadcast command that item will be opend, so directive with items page will be prepared
		$rootScope.$broadcast('open-item');
		$.mobile.changePage('#menuItemPage', {transition: "slideup"} );
	}

}]);


restApp

.directive('menuItemPage', ['menuFactory', 'cartFactory', '$rootScope', function( menuFactory, cartFactory, $rootScope ){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-pages/menuItemPage.html',
		scope: {},
		controller: function( $scope ) {
			$('#menuItemPage').page();
			// catching broadcast from the menu controller about item that will be opend
			$scope.$on('open-item', function(event, args) {
				$scope.currentItem = menuFactory.getCurrentItem();
				$scope.currency = menuFactory.getCurrency();
				$scope.selectedAmount = menuFactory.getCurrentAmount();
				$scope.itemStatus = menuFactory.getCurrentItemStatus();
				$scope.cartCount = cartFactory.getCartCount();
			});

			$scope.selectNum = function(num) {
				$scope.selectedAmount = num;
			};

			$scope.activeNum = function(num) {
				return $scope.selectedAmount == num
			};

			$scope.addItem = function() {
				var modifiersList = $('#select-modifiers').val();
				var modifiers = [];
				if ( !! modifiersList && modifiersList.length > 0 ) {
					for(var i=0; i < modifiersList.length; i++){
						// first I need to save index of modifier in menu object,
						// because it will be esier after that to create view when I will edit this Item
						var modifier = $scope.currentItem.modifiers[ modifiersList[i] ];
						modifier.indexID = modifiersList[i];
						modifiers.push( modifier );
					}
				}
				cartFactory.addItemToCart( $scope.currentItem, $scope.selectedAmount, modifiers );
				$.mobile.changePage('#cartPage', {transition: "slideup"} );
				$rootScope.$broadcast('open-cart');
			}

			$scope.saveItem = function() {
				cartFactory.removeItem( $scope.currentItem );
				$scope.addItem();
			}

			$scope.removeItem = function() {
				cartFactory.removeItem( $scope.currentItem );
				$.mobile.changePage('#cartPage', {transition: "slideup"} );
				$rootScope.$broadcast('open-cart');
				console.log( cartFactory.getCart() );
			}
		}
	}
}])

.directive('cartPage', ['menuFactory', 'cartFactory', '$rootScope', function( menuFactory, cartFactory, $rootScope ){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-pages/cartPage.html',
		scope: {},
		controller: function( $scope ) {
			$('#cartPage').page();

			$scope.$on('open-cart', function(event, args) {
				$scope.cart = cartFactory.getCart();
				$scope.currency = menuFactory.getCurrency();
				$scope.total = cartFactory.getTotal();
			});

			$scope.editItem = function( item ) {
				// function setCurrentItemById fill return TRUE if item was found, otherwise it will return FALSE
				// therefore we can rely on it in further code
				var itemSelected = menuFactory.setCurrentItemById( item.id );
				if ( itemSelected ){
					menuFactory.setCurrentAmount( item.amount );
					menuFactory.setCurrentItemStatus( 'edit' );
					menuFactory.setCurrentModifiers( item.modifiers );
					$rootScope.$broadcast('open-item');
					$.mobile.changePage('#menuItemPage', {transition: "slideup"} );
				}
			}
		}
	}
}])

.directive('multipleSelectWidget', ['menuFactory', '$timeout', function( menuFactory, $timeout ){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-widgets/multipleSelectWidget.html',
		scope: {},
		controller: function( $scope ) {
			$( "#select-modifiers" ).selectmenu();
			// catching broadcast from the menu controller about item that will be opend
			$scope.$on('open-item', function(event, args) {
				$scope.currentItem = menuFactory.getCurrentItem();
				$scope.currency = menuFactory.getCurrency();
				$scope.currentItemStatus = menuFactory.getCurrentItemStatus();
				// angular need time to proceed ngRepeat, short after that I need to refresh widget
				$timeout(function(){
					// If Item is new, then I need to clean it, otherwise, I need to select selected modifiers
					if ( $scope.currentItemStatus == 'new' ){
						// There is issue with selectmenu if opening twice the same item
						// I need to make sure, that all items are deselected
						$( "#select-modifiers" ).find( 'option' ).each(function(){
							$(this).removeAttr('selected');
						});
						// I still need to remove unneeded elements, because jQm dont' do it correctly
						$('#select-modifiers-menu li a').removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
					} else {
						var currentModifiers = menuFactory.getCurrentModifiers();
						$( "#select-modifiers" ).find( 'option' ).each(function(){
							$(this).removeAttr('selected');
							for(var i=0; i < currentModifiers.length; i++){
								if( $(this).val() == currentModifiers[i].indexID ) $(this).attr('selected', 'selected');
							}
						});
					}
					$( "#select-modifiers" ).selectmenu( 'refresh' );
				}, 100);
			});
		}
	}
}])
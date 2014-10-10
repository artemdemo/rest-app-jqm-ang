<!doctype html>
<html>
<head>
	<title>Rest App - Angular with jQm</title>
	
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	
	<link rel="stylesheet" href="vendor/jqm/jquery.mobile-1.4.4.min.css">
	<link rel="stylesheet" href="css/style.css">

	<script src="vendor/jquery-1.11.1.min.js"></script>						<!-- jQuery -->
	<script src="vendor/angular-1.2.26/angular.min.js"></script>		<!-- Angular -->
	<script src="vendor/jqm/jquery.mobile-1.4.4.min.js"></script>	<!-- jQuery Mobile -->
	
	<script src="app.js"></script>
	<script src="js/directives.js"></script>
	
</head>
<body ng-app="restApp" ng-controller="mainCtrl">


<div data-role="page" id="menuPage" ng-controller="menuListCtrl">

	<div role="main" class="ui-content">
		
		<ul id="menuList">
			<li ng-repeat="item in products" ng-click="openItem( item )">
				<div class="thumbnail"><img ng-src="img/{{ item.image }}" /></div>
				<div class="name">{{ item.name }}</div>
				<div class="price">{{ currency + item.price }}</div>
			</li>
		</ul>
		
	</div><!-- /content -->

	<div data-role="footer" data-position="fixed" ><h1>Rest App &copy; 2014</h1></div>
	
</div>


<menu-item-page></menu-item-page>

<cart-page></cart-page>


</body>
</html>
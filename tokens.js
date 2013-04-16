var app = angular.module('simplefin', []);

app.controller('TokenCtrl', function($scope) {
	$scope.accountChoice = 'All accounts';
	$scope.expirationDate = '2015-01-01';
	$scope.accounts = [
		{name: 'Checking', number: '123456'},
		{name: 'Savings', number: '234567'}
	];
	$scope.tokens = [];
	$scope.sfin_url = 'https://example.com/sfin'

	$scope.createToken = function() {
		// XXX fix this
		var accountChoice = $scope.accountChoice;
		var description = $scope.description;
		var expirationDate = $scope.expirationDate;

		// generate token -- this should be done on the server
		// not in the javascript
		var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var token = '';
		while (token.length < 50) {
			var r = Math.floor(Math.random() * charset.length);
			token += charset[r];
		}

		$scope.tokens.push({
			token: token,
			sfin_url: $scope.sfin_url,
			accounts: accountChoice,
			description: description,
			expirationDate: expirationDate
		});
		$scope.accountChoice = 'All accounts';
		$scope.description = '';
		$scope.expirationDate = '2015-01-01';
		$scope.mostRecentToken = token;
	};

	$scope.isExpired = function(token) {
		var now = new Date();
		var exp = new Date(token.expirationDate);
		return (now >= exp);
	}

	$scope.deleteToken = function(token, ev) {
		var index = $scope.tokens.indexOf(token);
		$scope.tokens.splice(index,1);
	};
})
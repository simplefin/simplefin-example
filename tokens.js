var app = angular.module('simplefin', []);

app.service('Server', function() {
	this.sfin_url = 'https://www.example.com/sfin';

	this.put = function(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}
	this.get = function(key) {
		return JSON.parse(localStorage.getItem(key));
	}
	this.getAccounts = function() {
		var accounts = this.get('accounts');
		if (!angular.isArray(accounts)) {
			accounts = [
				{name: 'Checking', number: '1238394'},
				{name: 'Savings', number: '28398403'}
			];
			this.put('accounts', accounts);
		}
		return accounts;
	}
	this.saveAccounts = function(accounts) {
		this.put('accounts', accounts);
	}
	this.getTokens = function() {
		var tokens = this.get('tokens');
		if (!angular.isArray(tokens)) {
			tokens = [];
			this.put('tokens', tokens);
		}
		return tokens;
	}
	this.saveTokens = function(tokens) {
		this.put('tokens', tokens);
	}
	this.generateSetupToken = function() {
		var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var access_token = '';
		var length = 50 + Math.floor(Math.random() * 50);
		while (access_token.length < length) {
			var r = Math.floor(Math.random() * charset.length);
			access_token += charset[r];
		}
		var setup_token = btoa(this.sfin_url + '\n' + access_token);
		return {
			'access_token': access_token,
			'sfin_url': this.sfin_url,
			'setup_token': setup_token,
			// pretend to hash right now
			'hash': access_token
		}
	}
})

app.controller('TokenCtrl', function($scope, Server) {
	$scope.accountChoice = 'All accounts';
	$scope.expirationDate = '2015-01-01';
	$scope.accounts = Server.getAccounts();
	$scope.tokens = Server.getTokens();

	$scope.$watch('tokens', function() {
		Server.saveTokens($scope.tokens);
	}, true);
	$scope.$watch('accounts', function() {
		Server.saveAccounts($scope.accounts);
	}, true);

	$scope.createToken = function() {
		var accountChoice = $scope.accountChoice;
		var description = $scope.description;
		var expirationDate = $scope.expirationDate;
		var generated = Server.generateSetupToken();

		$scope.tokens.push({
			hash: generated.hash,
			sfin_url: generated.sfin_url,
			accounts: accountChoice,
			description: description,
			expirationDate: expirationDate,
			enabled: true,
			last_used_ip: null,
			last_used: null
		});
		// reset form
		$scope.accountChoice = 'All accounts';
		$scope.description = '';
		$scope.expirationDate = '2015-01-01';
		$scope.mostRecentToken = generated.setup_token;
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
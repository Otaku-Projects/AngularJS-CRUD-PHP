// JavaScript Document
"use strict";

//angular.element() === jQuery() === $();
// using the angular ui of Bootstrap
//var app = angular.module('myApp', ['ngCookies', 'ngFileUpload', 'ui.router', "oc.lazyLoad", "bootstrapLightbox"]);
var app = angular.module('myApp', ['ngCookies', 'ngFileUpload', 'ui.router', "oc.lazyLoad", 'ngSanitize']);

app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'home',
			files: [
				'./js/controller/home.js',
				'../../third-party/countUp.js-2.0.4/dist/countUp-jquery.full.js'
			],
		}],
	});
});
app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'install01-getting-started',
			files: [
				'./js/controller/install01-getting-started.js'
			],
		}],
	});
});
app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'install02-release-history',
			files: [
				'./js/controller/install02-release-history.js',
				'../../third-party/showdownjs/1.9.1/showdown.js'
			],
		}],
	});
});
app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'install03-release-repository',
			files: [
				'./js/controller/install03-release-repository.js',
				'../../third-party/showdownjs/1.9.1/showdown.js'
			],
		}],
	});
});




app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'spec01',
			files: [
				'./js/controller/spec01-sys-block-diagram.js'
			],
		}],
	});
});
app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'spec02',
			files: [
				'./js/controller/spec02-client-architecture.js'
			],
		}],
	});
});

app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'release',
			files: [
				'./js/controller/release.js'
			],
		}],
	});
});
app.config(function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		modules: [{
			name: 'download',
			files: [
				'./js/controller/download.js'
			],
		}],
	});
});

	var newsArticleState = {
		name: "article",
		url: "/News/Article/{articleID}",
		views: {
			"content@": {
				templateUrl: '../en/article.html',
				controller: 'articleController'
			}
		},
		resolve: {
			articleID: function($transition$){
				//console.dir($transition$.params())
                return $transition$.params().articleID;
			},
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/article.js');
			}]
		}
	}
	var searchState = {
		name: "news",
		url: "/News",
		views: {
			"content@": {
				templateUrl: '../en/news.html',
				controller: 'newsController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/news.js');
			}]
		}
	}
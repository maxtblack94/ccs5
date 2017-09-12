angular.module('navController', []).controller('nav', function($scope, $state) {
		$scope.title = 'Project name';

		// returns true if the current router url matches the passed in url
		// so views can set 'active' on links easily
		$scope.isUrl = function(url) {
			if (url === '#') return false;
			return ('#' + $state.$current.url.source + '/').indexOf(url + '/') === 0;
		};

		$scope.pages = [
			{
				name: 'Home',
				url: '#/',
				pathName: 'home'
			},
			{
				name: 'About',
				url: '#/about',
				pathName: 'about'
			},
			{
				name: 'Contact',
				url: '#/contact',
				pathName: 'contact'
			},
			{
				name: 'Theme Example',
				url: '#/theme',
				pathName: 'theme'
			},
			{
				name: 'Blog',
				url: '#/blog',
				pathName: 'blog'
			},
			{
				name: 'Grid',
				url: '#/grid',
				pathName: 'grid'
			},
			{
				name: 'UI',
				url: '#/ui',
				pathName: 'ui'
			},
			{
				name: 'Dropdown Example',
				url: '#',
				subPages: [
					{
						name: 'About',
						url: '#/about'
					},
					{},
					{
						name: 'Header',
					},
					{
						name: 'Contact',
						url: '#/contact'
					}
				]
			}
		]
	});

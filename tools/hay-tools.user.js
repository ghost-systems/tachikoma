// ==UserScript==
// @name        Hamilton & Young Tools
// @description Get product data from hamiltonandyoungtrade.co.uk
// @namespace   lab.ghost.systems
// @noframes
// @include     http://www.hamiltonandyoungtrade.co.uk/*
// @grant		none
// @version     7.0.2
// ==/UserScript==

(function($) {

	HayTools = new function() 
	{
		var self = this;
		
		this.showSavedInfo = function()
		{
			$('body').html('<pre>' + self.allText + '</pre>');
		}

		this.label = 'H & Y Toolset';	
		this.tools = 
		[
			['Show Saved Info', self.showSavedInfo],
		];
	}
	
	tachikoma.Menu.addTools(HayTools);
	
})(gQuery);
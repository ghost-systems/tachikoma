// ==UserScript==
// @name        ChannelMax Tools
// @description ChannelMax Assistance
// @namespace   lab.ghost.systems
// @include     https://unified.channelmax.net/*
// @include     https://inventory.channelmax.net/*
// @grant		none
// @version     7.0.0
// ==/UserScript==

(function($) {

	CmaxTools = new function() 
	{
		var self = this;
		
		this.loadInventory = function()
		{
			window.location = "https://unified.channelmax.net/load.cmaxsso?action=load&url=https://inventory.channelmax.net/Default.aspx?ViewType=0&wname=winInventory";
		}
				
		this.label = 'ChannelMax Tools';
		this.tools = 
		[
			['Load Fullscreen Inventory', self.loadInventory]
		];
	}
	
	tachikoma.Menu.addTools(CmaxTools);
	
})(gQuery);
// ==UserScript==
// @name        Tachikoma
// @description Tachikoma System Additions.
// @namespace   lab.ghost.systems
// @noframes
// @include     *
// @grant		none
// @require		http://code.jquery.com/jquery-latest.js
// @version     6.5
// ==/UserScript==

window.gQuery = $.noConflict(true);
(function($) {
		
	console.log('Tachikoma v6.5 running on : ' + $().jquery);
	
	Utils = new function() 
	{
		var self = this;
		
		this.atTopLevel = function()
		{
			return (window.top == window.self);
		}
		
		this.toCamelCase = function(inputString)
		{
			return inputString
				.toLowerCase()
				.replace(/ (.)/g, function(match, group1) {
					return group1.toUpperCase();
				});
		}
		
		this.size = function(obj) 
		{
			var size = 0, key;
			for (key in obj) 
			{
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

	}
	
	Menu = new function()
	{
		var self = this;
		
		this.buildMenu = function()
		{
			if (Utils.atTopLevel()) {
				addMenuStyles()
				addMenuHtml();
				//addMenuHtml('bars');
				addMenuAnimations();
			}
		}
		
		function addMenuStyles() 
		{
			$('head').append('<link rel="stylesheet" href="https://lab.ghost.systems/tachikoma/resources/css/styles.css">');
		}
	
		function addMenuHtml(menuType)
		{
			if (menuType === 'bars') {
				// Three Bars
				$('body').append('<div id="gs-switch"><div class="gs-switchBoxAlt"></div><div class="gs-switchBoxAlt"></div><div class="gs-switchBoxAlt"></div></div><div id="gs-menu"></div><div id="gs-overlay"><div id="percentbar"></div><div id="txt"></div></div>');
			} else {
				// Four Boxes
				$('body').append('<div id="gs-switch"><div class="gs-switchBox"></div><div class="gs-switchBox"></div><div class="gs-switchBox"></div><div class="gs-switchBox"></div></div><div id="gs-menu"></div><div id="gs-overlay"><div id="percentbar"></div><div id="txt"></div></div>');
			}
		}
	
		function addMenuAnimations()
		{ 
			$('#gs-switch')
				.on('click', function() {
					$('body').toggleClass('gs-animated');
				});
		}
		
		this.addTools = function(toolset)
		{
			$('<h1>', {
				text: toolset.label
			})
				.appendTo('#gs-menu');

			var tools = toolset.tools;	
			for (var i=0; i<tools.length; i++) {
				this.addMenuItem(tools[i][0], tools[i][1]);
			}
			console.log(toolset.label + ' added.');
		}
		
		this.addMenuItem = function(label, tool)
		{
			var id = Utils.toCamelCase(label);
			$('<a>', {
				id: id,
				text: label,
				href: '#',
				click: tool
			})
			.appendTo('#gs-menu');
		}
		
		this.showOverlay = function()
		{
			if (!$('#gs-overlay').hasClass('show')) {
				$('#gs-overlay')
					.addClass('show');
			}
		}
		
		this.setOverlayProgress = function(percent)
		{
			if ($.isNumeric(percent)) {
				$('#percentbar')
					.css('width', percent + '%');
			}
		}
		
		this.setOverlayText = function(text) 
		{
			$('#gs-overlay #txt')
				.text(text);
		}
		
		this.setOverlayProgressAndText = function(percent, text)
		{
			self.setOverlayProgress(percent);
			self.setOverlayText(text);
		}
		
		this.setOverlayComplete = function(completionText, completionFunction)
		{
			self.setOverlayProgressAndText(100, completionText);
			$('#gs-overlay #txt')
				.on('click', completionFunction)
				.css('cursor', 'pointer'); 
		}
		
	}

	Menu.buildMenu();
	
	window.tachikoma = {};
	window.tachikoma.Utils = Utils;
	window.tachikoma.Menu = Menu;
	
})(gQuery);
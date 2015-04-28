// ==UserScript==
// @name        Tachikoma
// @description Tachikoma System Additions.
// @namespace   lab.ghost.systems
// @noframes
// @include     *
// @grant		none
// @require		http://code.jquery.com/jquery-latest.js
// @version     7.0.16
// ==/UserScript==

window.gQuery = $.noConflict(true);
(function($) {
		
	console.log('Tachikoma v7 running on : ' + $().jquery);
	
	Utils = new function() // Plain JS
	{
		var self = this;
		
		this.atTopLevel = function() // Plain JS
		{
			return (window.top == window.self);
		}
		
		this.toCamelCase = function(inputString) // Plain JS
		{
			return inputString
				.toLowerCase()
				.replace(/ (.)/g, function(match, group1) {
					return group1.toUpperCase();
				});
		}
		
		this.size = function(obj) // Plain JS
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
		
		function addMenuStyles() // Plain JS
		{
			// Create stylesheet link element.
			var styleSheet = document.createElement('link');
			styleSheet.rel = 'stylesheet';
			styleSheet.href = 'https://lab.ghost.systems/tachikoma/resources/css/styles.css';
			
			// Add to head element.
			document.getElementsByTagName('head')[0].appendChild(styleSheet);
		}
	
		function addMenuHtml(menuType) // Plain JS
		{
			// Create fragment parts.
			var fragment = document.createDocumentFragment(),
				toggle = document.createElement('div'),
				switchBox = document.createElement('div'),
				count = 4,
				menu = document.createElement('div'),
				overlay = document.createElement('div'),
				progress = document.createElement('div'),
				text  = document.createElement('div');

			// Set Id's and classes
			toggle.id = 'gs-switch';
			switchBox.className = 'gs-switchBox';
			menu.id = 'gs-menu';
			overlay.id = 'gs-overlay';
			progress.id = 'percentbar';
			text.id = 'txt';
				
			// Toggle's alternate display (3 Bars).
			if (menuType === 'bars') {
				switchBox.className = 'gs-switchBoxAlt';
				count = 3;
			}
			
			// Collate toggle elements.
			for (var i = 0; i < count; i++) {
				toggle.appendChild(switchBox.cloneNode());
			}
			
			// Collate overlay elements
			overlay.appendChild(progress);
			overlay.appendChild(text);
			
			// Collate fragment elements
			fragment.appendChild(toggle);
			fragment.appendChild(menu);
			fragment.appendChild(overlay);

			// Add fragment to page.
			document.getElementsByTagName('body')[0].appendChild(fragment);
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
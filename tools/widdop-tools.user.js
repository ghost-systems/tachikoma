// ==UserScript==
// @name        Widdop Tools
// @description Get product data from widdop.co.uk
// @namespace   lab.ghost.systems
// @noframes
// @include     http://www.widdop.co.uk/product/*
// @grant		none
// @version     2.1
// ==/UserScript==

(function($) {

	WiddopTools = new function() 
	{
		var self = this;
		this.currentSkus = 0;
		
		this.getPageData = function()
		{
			self.getProductData(false);
		}
	
		this.getAllData = function() 
		{
			self.showOverlay();
			self.getProductData(true);
		}
		
		this.showOverlay = function()
		{
			var totalSkus = self.getTotalSkus(),
				currentSkus = self.currentSkus || 0;
				percentLoaded = 0;
				
			console.log("Total skus : " + totalSkus);
			if (totalSkus > 0) {
				percentLoaded = Math.round((currentSkus / totalSkus) * 100);
			}
			
			tachikoma.Menu.showOverlay();
			tachikoma.Menu.setOverlayProgressAndText(percentLoaded, 'Extracting Data : ' + percentLoaded + '%');
		}

		this.getTotalSkus = function()
		{
			return parseInt($('#Label1').text().match(/of ([0-9]+)/)[1]);
		}

		this.getProductData = function(allPages)
		{

			$('.productdisplay, .productdisplayred')
				.each(function (index, domElement) 
					{
						var productCode = $('tr:eq(0) div:eq(0)', domElement).text().trim();
						var productClearance = $('tr:eq(0) div:eq(1) del', domElement).text().trim();
						
						$('td:eq(0) div:eq(1) del', domElement).remove();
							
						var productPrice = $('tr:eq(0) div:eq(1)', domElement).text().trim();
						var productDesc = $('tr:eq(1)', domElement).text().trim();
						var productStock = $('#divStock div', domElement).text().trim();
							
						if ($('center div img', domElement).length == 0) {
							var productAvail = 'Yes';
						} else {
							var productAvail = 'No';
						}
		
						var imageRoot = 'http://www.widdop.co.uk/prdimgmax/';
						var imageURL = imageRoot + productCode + '.jpg';
						
						if (typeof(self.allText) == 'undefined') {
							self.allText = '';	
						}
						
						self.allText = self.allText + productCode + "\t" + productPrice + "\t" + productClearance  + "\t" + productStock  + "\t" + productAvail + "\t" + productDesc + "\t" + imageURL + "\n";
						self.currentSkus = self.currentSkus + 1;
						console.log( self.currentSkus + " : \t" + productCode + "\t" + productPrice + "\t" + productClearance  + "\t" + productStock  + "\t" + productAvail + "\t" + productDesc + "\t" + imageURL );
					});

			if (allPages) {
				var nextButton = document.getElementById("lbtnNext");
				if (nextButton != null) {
					window.__doPostBack('lbtnNext','');
					window.setTimeout(self.getAllData, 10000);
				} else {
					tachikoma.Menu.setOverlayComplete('Data Extraction Complete', self.showSavedInfo);
				}
			} else {
				self.showSavedInfo();
			}
			return false;
		}
		
		this.showSavedInfo = function()
		{
			$('body').html('<pre>' + self.allText + '</pre>');
		}

		this.label = 'Widdop Toolset';	
		this.tools = 
		[
			['Extract Product Data (All)', self.getAllData],
			['Extract Product Data (This Page)', self.getPageData]
		];
	}
	
	tachikoma.Menu.addTools(WiddopTools);
	
})(gQuery);
// ==UserScript==
// @name        FBA Tools
// @description Scrape FBA Data from amazon.co.uk
// @namespace   lab.ghost.systems
// @noframes
// @include     https://sellercentral.amazon.co.uk/gp/ssof/knights/*
// @grant		none
// @version     7.0.18
// ==/UserScript==

(function($) {

	FbaTools = new function() 
	{
		var self = this;
		this.masterFbaInfo = [];
		this.showErrors = false;


		this.tidyPage = function() // Plain JS
		{
			var toRemove = [];
			
			// Add elements by ID
			toRemove.push(document.getElementById('rightWidget'));
			toRemove.push(document.getElementById('fba-capacity-widget'));
			toRemove.push(document.getElementById('fba-search-capabilities'));
			
			// Add 'br' elements by selector
			var breaks = document.querySelectorAll('.pg-content br');
			for (var i = 0; i < breaks.length; i++) {
				toRemove.push(breaks[i]);
			}
			
			// Remove all
			for (var i = 0; i < toRemove.length; i++) {
				toRemove[i].parentNode.removeChild(toRemove[i]);
			}			
	
		}
		
		this.saveAllData = function() 
		{
			self.showOverlay();
			self.nextPageToSave = self.nextPageToSave || 1;

			if (self.nextPageToSave == self.getCurrentPage()) {
				if ( !self.isCurrentPageFullyLoaded()) {
					window.setTimeout( self.saveAllData, 2000 );
				} else {
					self.saveFbaInfo();
					if (!self.isLastPage()) {
						self.loadNextPage();
						window.setTimeout(self.saveAllData, 2000);
					} else {
						tachikoma.Menu.setOverlayComplete('Data Extraction Complete', self.showSavedFbaInfo);
					}
				}
			} else {
				window.setTimeout(self.saveAllData, 2000);
			}			
		}
		
		this.saveAllDataWithErrors = function()
		{
			self.showErrors = true;
			self.saveAllData();	
		}
		
		this.getCurrentPage = function()
		{
			return parseInt($('#reportKnights tbody:last').attr('id').replace(/[^0-9]+/g,''));
		}

		this.isCurrentPageFullyLoaded = function()
		{
			var pageNumber = self.getCurrentPage(),
				loadingIndicators = '#reportKnights tbody#tb_pg' + pageNumber + ' tr td.fee-preview a.cost img';
				
			return ($(loadingIndicators).length == 0);
		}
		
		this.isLastPage = function()
		{
			var nextButton = $('div.pagination_pagenav a:contains("Next")');
			return !(nextButton.length > 0);
		}
		
		this.loadNextPage = function()
		{
			jQuery('div.pagination_pagenav a:contains("Next")').click();
			self.nextPageToSave += 1;
		}
		
		this.showOverlay = function()
		{
			var totalSkus = self.getTotalSkus(),
				percentLoaded = 0;
				
			if (totalSkus > 0) {
				percentLoaded = Math.round((tachikoma.Utils.size(self.masterFbaInfo) / totalSkus) * 100);
			}
			
			tachikoma.Menu.showOverlay();
			tachikoma.Menu.setOverlayProgressAndText(percentLoaded, 'Extracting Data : ' + percentLoaded + '%');
		}
		
		this.getTotalSkus = function()
		{
			return parseInt($('.pagination_itemcounts').text().match(/of ([0-9]+) Items/)[1]);
		}
		
		this.saveFbaInfo = function()
		{
			var count = 0;
			$('#reportKnights tbody tr td.fee-preview')
				.each(
					function(index, domElement) 
					{
						var errorText = '';
						// Get NLA Info
						var parentRow = $(this).parent();
						var errorRow = $('.wrap-long-text .itemError', parentRow);
						if ( errorRow.length ) {
							// ItemError Exists
							errorRow.parent().css('background-color', '#FF0000');
							errorText = errorRow
								.contents()
								.filter(function() {
									return this.nodeType === 3;
								})
								.text();
						}
						// Get Product Info
						var fbaJson = $('input.response', domElement).val();
						if (typeof fbaJson != 'undefined') {
							var fbaInfo = self.parseFbaJson(fbaJson);
							self.saveFbaProduct(fbaInfo.sku, [fbaInfo.commission, fbaInfo.pickpack, fbaInfo.weightFee, errorText]);
							$('a.cost', domElement)
								.text('[' + count + '] £ ' + fbaInfo.commission + ' + ' + fbaInfo.pickpack + ' + ' + fbaInfo.weightFee);
						} else {
							var sku = $(domElement).attr('data-msku');
							var undef;
							self.saveFbaProduct(sku, [undef, undef, undef, errorText]);
							$(domElement)
								.text('[' + count + '] --- ');
						}
						
						count++;
					}
				);
			console.log('Currently saved ' + tachikoma.Utils.size(self.masterFbaInfo) + ' unique SKUs.');
			return false;
		}
		
		this.updateFbaFeeColumnHeader = function()
		{
			$('#dt-col-fee-preview .dt-header')
				.html('FBA (Amz% + OH/PP + Wt)');
			return false;
		}
		
		this.parseFbaJson = function(fbaJson)
		{
			var amazonInfo = $.parseJSON(fbaJson),
				fbaInfo = {};

			fbaInfo.sku = amazonInfo.mSku;
			fbaInfo.commission = self.parseCurrency(amazonInfo.shipmentFee.Commission);
			fbaInfo.pickpack = self.parseCurrency(amazonInfo.fulfillmentFee.FBAPerUnitFulfillmentFee);
			fbaInfo.weightFee = self.parseCurrency(amazonInfo.fulfillmentFee.FBAWeightBasedFee);

			return fbaInfo;
		}
		
		this.parseCurrency = function(currency)
		{
			if (typeof(currency) != 'undefined') {
				return Number(0 + currency.replace(/[^0-9\.]+/g,'')).toFixed(2);	
			} else {
				return currency;	
			}
		}
		
		this.showSavedFbaInfo = function()
		{
			var count = 1, 
				sku,
				text = "#\tSKU\tComission\tPick/Pack\tWeight Fee\n";
				
				if (self.showErrors) {
					text = "#\tSKU\tErrorText\n";
				}
	
			for (sku in self.masterFbaInfo) 
			{
				if (sku != 'inArray') { // Chrome enumerates property inArray, unneeded in this list.
					
					text += count + "\t" + decodeURIComponent(sku);
					
					if (self.showErrors) {
						text +=	"\t" + self.masterFbaInfo[sku][3];
					} else {
						text +=	"\t" + self.masterFbaInfo[sku][0] + "\t" +
							self.masterFbaInfo[sku][1] + "\t" +
							self.masterFbaInfo[sku][2];
					}
					text += "\n"
					count++;
				}
			}
			$('body').html('<pre>' + text + '</pre>');
			return false;
		}
		
		this.saveFbaProduct = function(sku, info)
		{
			if (typeof self.masterFbaInfo[encodeURIComponent(sku)] == 'undefined') {
				self.masterFbaInfo[encodeURIComponent(sku)] = info;
			}
		}
		
		this.label = 'Amazon FBA Tools';
		this.tools = 
		[
			['Compact Page', self.tidyPage],
			['Extract FBA Product Data', self.saveAllData],
			['Extract FBA Product Errors', self.saveAllDataWithErrors],
		];
	}
	
	tachikoma.Menu.addTools(FbaTools);
	
})(gQuery);
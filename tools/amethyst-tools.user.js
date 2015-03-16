// ==UserScript==
// @name        Amethyst Dublin Tools
// @description Get product data from amethystdublin.com
// @namespace   lab.ghost.systems
// @noframes
// @include     http://www.amethystdublin.com/*
// @grant		none
// @version     7.0.6
// ==/UserScript==

(function($) {

	AmethystTools = new function() 
	{
		var self = this;
		this.currentSkus = 0;
		this.productLinks = '';
		
		this.resetLocalStorage = function()
		{
			localStorage.clear();
			localStorage.setItem('allProductData', "SKU\tTitle\tDescription\tLegend\tRange\tPrice\tImage\tImage Resized\n");
		}
		
		this.run = function()
		{
			console.log('Amethyst Tools Running...');
			self.loadStoredData();
			if ( self.productLinks !== '') {
				console.log('Scrape Started:');
				self.getAllProductData();
			} else {
				console.log('Scrape Not Yet Started:');
			}
		}
		
		this.loadStoredData = function()
		{
			self.finished = (localStorage.getItem('finished') !== null) ? self.parseBoolean(localStorage.getItem('finished')) : false;
			self.productLinks = (localStorage.getItem('productLinks') !== null) ? localStorage.getItem('productLinks') : '';
			self.categories = (localStorage.getItem('categories') !== null) ? localStorage.getItem('categories') : '';
			console.log('Data Loaded:');
			console.log('--------------------------');
			console.log(self.finished);
			console.log(self.categories);
			console.log(self.productLinks);
			console.log('--------------------------');
		}
		
		this.parseBoolean = function(toTest)
		{
			return (toTest === "true");
		}
		
		this.getAllProductData = function()
		{
			console.log('Getting Product Data:');
			var activeProductLink = self.getActiveProductLink();
			if (activeProductLink.length > 1) {
				activeProductLink = "http://www.amethystdublin.com" + activeProductLink + '/';
				console.log(activeProductLink);
				console.log(window.location + '');
				if (window.location != activeProductLink) {
					console.log('Not on Product Page');
					window.location = activeProductLink;
				} else {
					console.log('On Product Page');
					self.getProductData();
					self.getNextProductLink();
					self.getAllProductData();
				}
			} else {
				console.log('Finished');
				self.showSavedInfo();
			}
			
		}
		
		this.getActiveProductLink = function()
		{
			console.log('Getting Product Link:');
			productLink = self.productLinks.split("\n")[0];
			console.log(productLink);
			return productLink;
		}
		
		this.getNextProductLink = function()
		{
			console.log('Getting Next Product Link:');
			allProductLinks = self.productLinks.split("\n");
			allProductLinks.shift();
			self.productLinks = allProductLinks.join("\n");
			localStorage.setItem('productLinks', self.productLinks);
		}
		
		this.getProductData = function()
		{
			console.log('Getting Product Data from Page:');
			var productTitle = $('#product_page h1').first().css('background-color','deepskyblue').text();
			var productImageResized = $('#product-gallery img').first().attr('src');
			var productImage = $('#product-gallery a').first().attr('href');
			var productDesc = $('.description').text().trim();
			var productSku = $('.basic-info li em').first().text().trim();
			var productRange = $('.basic-info li:nth-child(2) em').text().trim();
			var productPrice = $('.basic-info .price').text().trim();
			
			var productLegend = '';
			productDesc = productDesc.replace(/\s+/g, " ");
			if (productDesc.indexOf("Legend: ") != -1) {
				productLegend = productDesc.split("Legend: ")[1];
				productDesc = productDesc.split("Legend: ")[0];
			}
			
			console.log(productTitle);
			console.log(productImageResized);
			console.log(productImage);
			console.log(productDesc);
			console.log(productLegend);
			console.log(productSku);
			console.log(productRange);
			console.log(productPrice);
			var allProductData = productSku + "\t" 
								+ productTitle + "\t" 
								+ productDesc + "\t"
								+ productLegend + "\t"
								+ productRange + "\t"
								+ productPrice + "\t"
								+ productImage + "\t"
								+ productImageResized + "\n";
			localStorage.setItem('allProductData', localStorage.getItem('allProductData') + allProductData);
		}
		
		this.getCategories = function()
		{
			self.categories = '';
			$('.side-nav-sub a').each(function(i){
				self.categories += $(this).attr('href') + "\n";
			});
			localStorage.setItem('categories',self.categories);
			console.log(self.categories);
		}
		
		this.getData = function() 
		{
			self.totalSkus = self.getTotalSkus();
			console.log("Total skus : " + self.totalSkus);
			self.getAllLinks();
		}
		
		this.getTotalSkus = function()
		{
			return parseInt($('.pagination').text().match(/of ([0-9]+)/)[1]);
		}
		
		this.getAllLinks = function()
		{
			$('.item-photo a').each(function(i){
				self.productLinks += $(this).attr('href') + "\n";
			});
			console.log(self.productLinks);
			localStorage.setItem('productLinks',self.productLinks);
			location.reload();
		}
		
		this.showSavedInfo = function()
		{
			$('body').html('<pre>' + localStorage.getItem('allProductData') + '</pre>');
		}

		this.label = 'Amethyst Toolset';	
		this.tools = 
		[
			['Extract Product Data (All)', self.getData],
			['Show Data', self.showSavedInfo],
			['Reset', self.resetLocalStorage],
			['Get Categories', self.getCategories],
		];
	}
	
	
	tachikoma.Menu.addTools(AmethystTools);
	AmethystTools.run();
	
})(gQuery);
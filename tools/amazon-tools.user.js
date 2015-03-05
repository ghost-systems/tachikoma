// ==UserScript==
// @name        Amazon Tools
// @description Amazon UK & US Tools
// @namespace   lab.ghost.systems
// @noframes
// @include     https://catalog-sc.amazon.co.uk/abis/*
// @include		http://www.amazon.co.uk/gp/product/*
// @include		https://catalog.amazon.com/abis/*
// @grant		none
// @version     1.0
// ==/UserScript==

(function($) {

	AmazonTools = new function() 
	{
		var self = this;
		this.productInfo = [];
		
		this.copyProductDataFromInventory = function()
		{
			var product = {};

			// Get Basics
			product.name = 			$('#item_name').val().trim();
			product.sku =			$('#offering_sku_display').text().trim();
			product.ean = 			$('#external_id_display').text().trim();
			product.asin =			$('#asin_display').text().trim();
			product.manufacturer = 	$('#manufacturer').val().trim();
			product.brand = 		$('#brand_name').val().trim();
			product.description = 	$('#product_description').text().trim();
			// Get Bullets
			product.bullet1 = 		$('#bullet_point\\[0\\]').val().trim();
			product.bullet2 = 		$('#bullet_point\\[1\\]').val().trim();
			product.bullet3 = 		$('#bullet_point\\[2\\]').val().trim();
			product.bullet4 = 		$('#bullet_point\\[3\\]').val().trim();
			product.bullet5 = 		$('#bullet_point\\[4\\]').val().trim();
			// Get Search terms
			product.search1 = 		$('#generic_keywords\\[0\\]').val().trim();
			product.search2 =		$('#generic_keywords\\[1\\]').val().trim();
			product.search3 =		$('#generic_keywords\\[2\\]').val().trim();
			product.search4 = 		$('#generic_keywords\\[3\\]').val().trim();
			product.search5 = 		$('#generic_keywords\\[4\\]').val().trim();
			
			// Copy to site
			var allText = JSON.stringify(product);
			alert(allText);
							
			var formData = new FormData();
			formData.append('text', allText);
			
			$.ajax(
				{
					url: 'http://lab.buzzbase.co.uk/copy.php',
					type: 'POST',
					data: formData,
					contentType: false,
					processData: false,
					cache: false
				}
			)
			
			// Open new page for actual amazon item
			window.open('http://www.amazon.co.uk/gp/product/' + product.asin)
			
			return false;
		}
		
		this.copyProductDataFromProductPage = function()
		{
			var product, key;
			
			$.ajax(
				{
					url:"http://lab.buzzbase.co.uk/paste.php",
					dataType: 'jsonp',
					success:function(json)
					{
						try {
							product = $.parseJSON(json);
							for (key in product) {
								console.log(key + ' : ' + product[key]);
							}
							
							if (product['name'] == '') {
								product['name'] = $('#btAsinTitle').text().trim();
								console.log('No Name saved, adding : ' + product['name']);
							} else {
								console.log('Name already saved');
							}
							
							if (product['description'] == '') {
								product['description'] = $('#product-description-iframe').contents().find('.content').text().trim();
								console.log('No Description saved, adding : ' + product['description']);
							} else {
								console.log('Description already saved');
							}
							
							if (product['bullet1'] == '') {
								product['bullet1'] = $('#feature-bullets li:eq(0)').text().trim();
								console.log('No Bullet 1 saved, adding : ' + product['bullet1']);
							} else {
								console.log('Bullet 1 already saved');
							}

							if (product['bullet2'] == '') {
								product['bullet2'] = $('#feature-bullets li:eq(1)').text().trim();
								console.log('No Bullet 2 saved, adding : ' + product['bullet2']);
							} else {
								console.log('Bullet 2 already saved');
							}

							if (product['bullet3'] == '') {
								product['bullet3'] = $('#feature-bullets li:eq(2)').text().trim();
								console.log('No Bullet 3 saved, adding : ' + product['bullet3']);
							} else {
								console.log('Bullet 3 already saved');
							}

							if (product['bullet4'] == '') {
								product['bullet4'] = $('#feature-bullets li:eq(3)').text().trim();
								console.log('No Bullet 4 saved, adding : ' + product['bullet4']);
							} else {
								console.log('Bullet 4 already saved');
							}

							if (product['bullet5'] == '') {
								product['bullet5'] = $('#feature-bullets li:eq(4)').text().trim();
								console.log('No Bullet 5 saved, adding : ' + product['bullet5']);
							} else {
								console.log('Bullet 5 already saved');
							}
							
							var allText = JSON.stringify(product);
											
							var formData = new FormData();
							formData.append('text', allText);
							
							$.ajax(
								{
									url: 'http://lab.buzzbase.co.uk/copy.php',
									type: 'POST',
									data: formData,
									contentType: false,
									processData: false,
									cache: false
								}
							)
							
						} catch (e) {
							console.error("Parsing error:", e); 
						}
					},
					error:function()
					{
						alert("AJAX Error");
					},
				}
			);
			
			return false;
		}
		
		this.pasteProductData = function()
		{
			$.ajax(
				{
					url:"http://lab.buzzbase.co.uk/paste.php",
					dataType: 'jsonp',
					success:function(json)
					{
						// do stuff with json (in this case an array)
						//alert(json);
						try {
							product = $.parseJSON(json);
							alert(product.name);
							
							$('#item_name').val(product.name);
							$('#offering_sku').val(product.sku);
							$('#external_id').val(product.ean);
							$('#manufacturer').val(product.manufacturer);
							$('#brand_name').val(product.brand);
			 				$('#product_description').text(product.description);
							// Paste Bullets
							$('#bullet_point\\[0\\]').val(product.bullet1);
							$('#bullet_point\\[1\\]').val(product.bullet2);
							$('#bullet_point\\[2\\]').val(product.bullet3);
							$('#bullet_point\\[3\\]').val(product.bullet4);
							$('#bullet_point\\[4\\]').val(product.bullet5);
							// Paste Search terms
							$('#generic_keywords\\[0\\]').val(product.search1);
							$('#generic_keywords\\[1\\]').val(product.search2);
							$('#generic_keywords\\[2\\]').val(product.search3);
							$('#generic_keywords\\[3\\]').val(product.search4);
							$('#generic_keywords\\[4\\]').val(product.search5);
							
						} catch (e) {
							console.error("Parsing error:", e); 
						}
					},
					error:function()
					{
						alert("Error");
					},
				}
			);
			return false;
		}
		
		
		this.label = 'Amazon Tools';
		this.tools = 
		[
			['Copy Product Data - Inventory', self.copyProductDataFromInventory],
			['Copy Product Data - Product Page', self.copyProductDataFromProductPage],
			['Paste Product Data', self.pasteProductData]
		];
	}
	
	tachikoma.Menu.addTools(AmazonTools);
	
})(gQuery);
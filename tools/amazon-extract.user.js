// ==UserScript==
// @name        Amazon Extraction Tools
// @description Extract Data from amazon US
// @namespace   lab.ghost.systems
// @noframes
// @include     https://catalog.amazon.com/abis/*
// @grant		none
// @version     1.0
// ==/UserScript==

(function($) {

	AmazonExtract = new function() 
	{
		var self = this;
		this.extractData = {};
		this.extractData.toExtract = [
			['TTW10BC_01T', 'B00NGQPCWG'],
			['TTW10BC_02T', 'B00NGQPE88'],
			['TTW10BC_03T', 'B00NGQPFDC'],
			['TTW10BC_04T', 'B00NGQPIJI'],
			['TTW10BC_05T', 'B00NGQPJK6'],
		];
		
		this.extractAllData = function()
		{
			
		}
		
		this.loadExtractData = function()
		{
			if (localStorage.getItem('extractData') != null) {
				self.extractData = $.parseJSON(localStorage.getItem('extractData'));
				console.log('Loaded extraction data');
			} else {
				console.log('Loaded static data');
			}
		}
	
		this.saveExtractData = function()
		{
			localStorage.setItem('extractData', JSON.stringify(self.extractData));
			console.log('Saved extraction data');
			console.log(self.extractData);
		}		
		
		this.label = 'Amazon Data Extraction';
		this.tools = 
		[
			['Extract Amazon Data', self.extractAllData]
		];
	}
	
	tachikoma.Menu.addTools(AmazonExtract);
	
})(gQuery);
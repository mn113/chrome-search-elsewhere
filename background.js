/*
 * Search Elsewhere - a Chrome Extension
 * author: M. Nicholson
 * 2016-11-11
 */

var SE = (function() {
	
	// Scrape the page's search query:
	function getPageQuery() {
		return chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			// Send message to the content script to get back query:
			return chrome.tabs.sendMessage(tabs[0].id, {message: "Hi"}, function(resp) {
				console.log("Response:", resp.query);
				return resp.query;
			});
		});
	}

	
	// Launch a new search in a new tab:
	function launchSearch(engine, query) {
		var urls = {
			"ddg": "https://duckduckgo.com/?q=",		// ok
			"gg":  "https://www.google.co.uk/#q=",		// ok
			"gi":  "https://www.google.co.uk/search?site=imghp&tbm=isch&q=",	// ok
			"gm":  "https://www.google.co.uk/maps/search/",	// ok
			"stp": "https://startpage.com/?q="	// NO
		};
		var baseUrl = urls[engine];
		
		// New tab with baseUrl + query:
		chrome.tabs.create({
			url: baseUrl + query
		});	
	}

	
	function init() {
		// Add onclick listener for buttons:
		document.body.addEventListener('click', function(e) {
			var engine = e.target.name;
			var query = SE.getPageQuery()
			console.log(engine, "clicked,", query);
			// Small delay to ensure we have a query:
			setTimeout(function() {
				SE.launchSearch(engine, query);
			}, 500);
		});
	}

	
	// Reveal module publicly:
	return {
		getPageQuery: getPageQuery,
		launchSearch: launchSearch,
		init: init
	};

}());

// Start when DOM loaded:
document.addEventListener("DOMContentLoaded", function() {
	SE.init();
});

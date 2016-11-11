/*
 * Search Elsewhere - a Chrome Extension
 * author: M. Nicholson
 * 2016-11-11
 */

var SE = (function() {
	
	// Scrape the page's search query:
	function getQuery() {
		return chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
			// Identify current search site:
			var url = tab[0].url;
			console.info("Location:", url);
			
			// Scrape search query from main input:
			var selector;
			// DuckDuckGo's input field:
			if (url.indexOf('duckduckgo') !== -1) {
				selector = "#search_form_input";
			}
			// Startpage's input field:
			else if (url.indexOf('startpage') !== -1) {
				selector = "#query_top";
			}
			// Try generic selector for Google + any other sites:
			else {
				selector = 'input[name="q"]';
			}
			console.info("Sel:", selector)
			
			// Send message to the content script to get back query:
			return chrome.tabs.sendMessage(tab.id, {selector: selector}, function(resp) {
				console.log("R:", resp);
				return resp;
			});
		});
	}

	
	// Launch a new search in a new tab:
	function launch(engine, query) {
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
			console.log(engine, "clicked");
			SE.launch(engine, SE.getQuery());
		});
	}

	
	// Reveal module publicly:
	return {
		getQuery: getQuery,
		launch: launch,
		init: init
	};

}());

// Start when DOM loaded:
document.addEventListener("DOMContentLoaded", function() {
	SE.init();
});

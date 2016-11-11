/*
 * Search Elsewhere - a Chrome Extension
 * author: M. Nicholson
 * 2016-11-11
 */

var SE = {};

// Find & scrape main search input field:
SE.findQuery = function() {
	// Identify current search site:
	var url = window.location.host;

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

	// Get the input field value:
	var q = document.querySelector(selector).value;
	console.info("Val:", q);
	return q;
}


// Listen for the background script's message, and return the page's search query:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message === "Hi") sendResponse({ query: SE.findQuery() });
});



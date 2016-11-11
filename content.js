// Listen for the background script's selector,
// and return the input field value:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var v = document.querySelector(request.selector).value;
	console.log("Val:", v);
	sendResponse({query: v});
});
// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//       const url = new URL(details.url);
//       if (url.hostname === "www.google.com" && url.pathname === "/search") {
//         const query = url.searchParams.get("q");
//         console.log("Search Query:", query);
        
//       }
//     },
//     {urls: ["*://www.google.com/search?*"]},
//     ["blocking"]
//   );

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
      chrome.windows.create({
        type: 'popup',
        url: 'popup.html',
        width: 300,
        height: 300
      });
    }
  });
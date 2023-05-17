chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) =>{
    if (request === "reload") {
      console.log("走到这里, 重载");
      chrome.runtime.reload()
    }

    return false;
  }
);

chrome.webNavigation.onCompleted.addListener(
  (e) => {

  },
  {
    url: [
      {urlPrefix: 'https://www.pathofexile.com/trade'},
    ]
  }
);

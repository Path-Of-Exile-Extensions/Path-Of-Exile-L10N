chrome.webNavigation.onCompleted.addListener(
  (e) => {
    // 进入交易页面
  },
  {
    url: [
      {urlPrefix: 'https://www.pathofexile.com/trade'},
    ]
  }
);

import {DB} from "@poel10n/extra";

await DB.Instance.initialize();
chrome.webNavigation.onCompleted.addListener(
  (e) => {

  },
  {
    url: [
      {urlPrefix: 'https://www.pathofexile.com/trade'},
    ]
  }
);

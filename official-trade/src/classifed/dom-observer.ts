import {Ext, QS} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";

function textNodesUnder(el: Element) {
  let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  while (n = walk.nextNode()) a.push(n);
  return a;
}

export namespace Search {
  export namespace Results {
    let freezed = false;
    const handle = () => {
      // if (freezed) {
      //   return;
      // }
      // freezed = true;
      const resultsetEL = QS.querySelector(document, "#trade > div.results > .resultset")
      Array.from(resultsetEL.children as HTMLElement[])
        .forEach((resultEL, index) => {
          const nodes = textNodesUnder(resultEL).filter((i) => {
            const textContent = i.textContent?.trim();
            return textContent;
          })
          const texts = nodes.map(i => i.textContent!.trim())
          Ext.send
            .toRuntime$({
              identify: ExtMessagesIdentities["Query:Full"],
              payload: texts
            })
            .then(res => {
              console.log("te", res)
            })
        })
      // freezed = false;
    }

    export const observer = () => {
      const resultsEL = QS.querySelector(document, "#trade > div.results")
      const observer = new MutationObserver(() => {
        const resultsetEL = QS.querySelector(resultsEL!, ".resultset")
        if (!resultsetEL) {
          return
        }
        const resultsetObserver = new MutationObserver(() => {
          handle();
          resultsetObserver.disconnect();
        })
        resultsetObserver.observe(resultsetEL, {childList: true})
      })
      observer.observe(resultsEL!, {childList: true})
    }
  }
}

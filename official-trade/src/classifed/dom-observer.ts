import {Ext, QS} from "@poe-vela/core/browser";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {globalx} from "@/classifed/globalx";

function textNodesUnder(el: Element) {
  let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  while (n = walk.nextNode()) a.push(n);
  return a;
}

export namespace Search {
  export namespace Results {
    let freezed = false;
    const handle = () => {
      if (freezed) {
        return;
      }
      freezed = true;
      const resultsetEL = QS.querySelector(document, "#trade > div.results > .resultset")
      Array.from(resultsetEL.children as unknown as HTMLElement[])
        .forEach((resultEL, index) => {
          const nodes = textNodesUnder(resultEL).filter((i) => {
            const textContent = i.textContent?.trim();
            return textContent;
          })
          const texts = nodes.map(i => i.textContent!.trim())
          Ext.message
            .post$<string[]>(
              globalx.port!,
              {
              identify: ExtMessagesIdentities["Query:Full"],
              payload: texts
            })
            .then(res => {
              res.forEach((text, index) => {
                if (text) {
                  console.log("找到了", text)
                  nodes[index].textContent!.replace(texts[index], text);
                }
              })
            })
        })
      freezed = false;
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

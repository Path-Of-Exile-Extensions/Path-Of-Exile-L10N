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
          const descriptionEL = QS.querySelector(resultEL, ".itemPopupContainer.newItemPopup.uniquePopup")
          const itemBoxContentEL = QS.querySelector(resultEL, ".itemBoxContent .content")
          const itemPopupAdditionalEL = QS.querySelector(resultEL, ".itemPopupAdditional")
          if (!itemBoxContentEL) {
            return
          }

          const properties = [
            ...QS.querySelectorAll(itemBoxContentEL!, ".property"),
            ...QS.querySelectorAll(itemBoxContentEL!, ".itemLevel"),
          ]

          properties.forEach(el => {
            const span = QS.querySelector(el, "span > span")
            let textContent = span!.textContent!.trim();
            if (textContent && textContent.endsWith(":")) {
              textContent = textContent.slice(0, -1)
              Ext.message
                .post$<string | undefined>(
                  globalx.port!,
                  {
                    identify: ExtMessagesIdentities["Query:Full"],
                    payload: textContent
                  })
                .then(res => {
                  if (res) {
                    span!.textContent = span.textContent!.replace(textContent, res)
                  }
                })
            }
          })

          const explicitMods = QS.querySelectorAll(itemBoxContentEL!, ".explicitMod")
          explicitMods.forEach(mod => {
            const contentEL = mod.children[1] as HTMLElement
            if (!contentEL || !contentEL.dataset) {
              console.log("contentEL.dataset no", mod)
              return
            }
            let statId = contentEL.dataset.field!
            if (statId.startsWith("stat.")) {
              statId = statId.slice(5)
            }
            const textContent = contentEL.textContent!.trim();
            Ext.message
              .post$<string | undefined>(
                globalx.port!,
                {
                  identify: ExtMessagesIdentities["Query:Stat"],
                  payload: {
                    stat: textContent,
                    statId,
                  }
                })
              .then(res => {
                if (res) {
                  contentEL.textContent = res
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

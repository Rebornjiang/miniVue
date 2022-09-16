export function parseElOption (el: string | Element): Element {
  if (el && typeof el === 'string') {
    const dom = document.querySelector(el)
    return dom as Element
  }
  return el as Element
}

export function isElement (elm: any): elm is Element {
  return elm.nodeType
}

export function getOutHtml (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.outerHTML
  }
}

export function parseElOption (el:string | Element):Element {
  let domRt
  if (el && typeof el === 'string') {
    const dom = document.querySelector(el)
    domRt = dom
  }
  domRt = el as Element
  return domRt
}

export function isElement (elm: any): elm is Element {
  return elm.nodeType
}

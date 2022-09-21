import { makeMap } from '@/common/utils'
import { parseHTMLOptions } from '.'

// # typescript
// type attr = {
//   name:
// }
interface Attr {
  name: string;
  value: string;
  start?: number;
  end?: number;
}

interface startTag {
  tag: string;
  lowerCaseTag: string;
  attrs: Attr[];
  start: number;
  end: number;
}
interface startTagMatch {
  tagName: string;
  start: number;
  end: number;
  attrs: RegExpMatchArray[];
  unarySlash?: string;
}

// # Regexp
const commentRe = /^<!--/
const ieConditionComment = /^!\[/
const doctype = /^<!DOCTYPE [^>]+>$/i

const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const attribute =
  /^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// # utils For CurFunc
const regexpCache:Record<string, RegExp> = {}
export const isPlainTextElement = makeMap('script,style,textarea')

export function parseHTML (html: string, options: parseHTMLOptions) {
  const { start, end: handleCloseTag, chars, comment, shouldKeepComment, isUnaryTag } = options
  const stack: startTag[] = []
  let lastTag:string | undefined, last

  console.log(stack, last)
  let index = 0 // 这个变量表示整个 html 中当前正在处理的 string 的开始 idx
  while (html) {
    last = html
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<') // 表示文本结束的  idx
      if (textEnd === 0) {
        //  textEnd = 0 ， 表非文本结束，可能就会有：注释节点，标签开始结束，IE IF condition；<!DOCTYPE
        // 注释节点
        if (commentRe.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd > 0) {
            // 存在注释内容，需要看看当前 compileOptions 是否保留注释节点
            if (shouldKeepComment) {
              comment(
                html.substring(4, commentEnd),
                index,
                index + commentEnd + 3
              )
            }
          }
          advance(commentEnd + 3)
          continue
        }

        // IE ifCondition
        if (ieConditionComment.test(html)) {
          const ieConditionCommentEnd = html.indexOf(']-->')
          if (ieConditionCommentEnd > 0) {
            advance(ieConditionCommentEnd + 4)
            continue
          }
        }

        // DOCTYPE
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }

        // end Tag
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          const curIdx = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIdx, index)
          continue
        }

        // start Tag
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          handleStartTagMatchRes(startTagMatch)
          continue
        }
      }
      // 若是以上条件未命中逻辑，当作文本处理
      let text, rest, next
      if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (!endTag.test(rest) && !startTagOpen.test(rest) && !commentRe.test(rest) && !ieConditionComment.test(rest)) {
          //
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
      }

      if (text) {
        advance(text.length)
      }

      if (chars && text) {
        chars(text, index - text.length, index)
      }
    } else {
      // 处理纯文本内容的元素 script,style,textarea
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      // 创建并缓存正则
      const reStackedTag = regexpCache[stackedTag] || (regexpCache[stackedTag] = new RegExp(`([\\s\\S]*?)(</${stackedTag}[^>]*>)`, 'i'))

      const rest = html.replace(reStackedTag, (all, text, endTag) => {
        endTagLength = endTag.length
        chars?.(text)
        return ''
      })
      // 下次处理 html 的开始索引
      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    if (last === html) {
      console.error('出现了意想不到的错误，未进行任何 html 的解析')
      chars?.(html)
      break
    }
  }

  parseEndTag()

  function advance (cutIdx: number) {
    index += cutIdx
    html = html.substring(cutIdx)
  }

  function parseStartTag () {
    const match = html.match(startTagOpen)
    if (!match) return undefined
    const matchRes: startTagMatch = {
      tagName: match[1],
      start: index,
      attrs: [],
      end: 0 // initialVal
    }
    advance(match[0].length)
    // 处理开始标签中的属性
    let end, attr: any
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(dynamicArgAttribute) || html.match(attribute))
    ) {
      attr.start = index
      advance(attr[0].length)
      attr.end = index
      matchRes.attrs.push(attr)
    }
    if (end) {
      matchRes.unarySlash = end[1]
      advance(end[0].length)
      matchRes.end = index
      return matchRes
    }
  }

  function handleStartTagMatchRes (match: startTagMatch) {
    const { tagName, unarySlash, attrs } = match

    // 浏览器关于 html 的容错机制的处理

    // 用 逻辑与 为了兼容 一元组件写法 的处理
    const unary = isUnaryTag?.(tagName) || !!unarySlash

    const l = match.attrs.length
    const finallAttr: Attr[] = []

    for (let i = 0; i < l; i++) {
      const attr = attrs[i]
      const value = attr[3] || attr[4] || attr[5] || '' // 取到最终的结果
      finallAttr.push({ name: attr[1], value })
    }

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCaseTag: tagName.toLowerCase(),
        attrs: finallAttr,
        start: match.start,
        end: match.end
      })
      lastTag = tagName
    }

    if (start) {
      start(tagName, finallAttr, unary, match.start, match.end)
    }
  }

  function parseEndTag (tagName?: string, start?: number, end?: number) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // tagName 什么时候可能不存在？
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCaseTag === lowerCasedTagName) {
          // 找到 闭口标签对应的开口标签
          break
        }
      }
    } else {
      pos = 0
    }

    if (pos >= 0) {
      for (let i = stack.length - 1; i >= pos; i--) {
        // 检测是否有未闭口标签
        if (i > pos) {
          console.warn('有为闭口标签', stack[i].tag)
        }

        handleCloseTag(tagName as string, start, end)
      }

      stack.length = pos
      lastTag = stack[pos - 1]?.tag
    }
  }
}

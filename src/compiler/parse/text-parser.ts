
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function parseText (text: string, delimiters?: [string, string]) {
  console.log({ text })
  const tagRE = delimiters ? /./ : defaultTagRE
  if (!tagRE.test(text)) return undefined
  const tokens: string[] = []
  const rawTokens: (Record<string, string> | string)[] = []

  // 上面 test 方法会变更 lastIndex 的值
  // {{expression}} 插值表达式为可能有多个为全局匹配，RegExp.lastIndex 是一个可读可写的属性，用于指定全局
  // 匹配时下一次开始匹配的 test & exec 方法索引开始位置，如果大于 字符串长度将会匹配失败；
  let lastIndex = (tagRE.lastIndex = 0)

  let match, tokenValue
  while ((match = tagRE.exec(text))) {
    const index = match.index

    // 处理 text 中除了插值表达式的文本
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      tokens.push(JSON.stringify(tokenValue))
    }

    // 插值表达式, 目前暂不需要处理 filter 语法
    const exp = match[1].trim()
    console.log({ exp })
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }

  // 处理 插值表达式末尾的文本
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }

  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/* eslint-disable no-use-before-define */

declare type ASTAttr = {
  name: string;
  value: any;
  dynamic?: boolean;
  start?: number;
  end?: number;
};

declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: ASTAttr[];
  rawAttrsMap: Record<string, ASTAttr>;
  attrsMap: Record<string, string>;
  parent: ASTElement | void;
  children: ASTNode[];

  start?: number;
  end?: number;
  forbidden?: boolean;
};

declare type ASTExpression = {
  type: 2;
  expression: string;
  tokens: (string | Record<string, string>)[];
  text: string;
};

declare type ASTText = {
  type: 3;
  text: string;
  static?: boolean;
  isComment?: boolean;
  start?: number;
  end?: number;
};

declare type ASTNode = ASTElement | ASTText | ASTExpression;

export declare interface CompiledResult {
  ast: ASTElement | null;
  render: string;
}

export declare interface CompilerOptions {
  // 用户设置
  comments?: boolean; // 是否保留注释节点
  expectHTML?: true; // 是否按照浏览器的默认行为进行处理 html，例如：p标签嵌套非段落标签，li标签嵌套li标签
  isNonPhrasingTag?: (tag: string) => boolean | undefined;
  isUnaryTag?: (tag: string) => boolean | undefined;
  canBeLeftOpenTag?: (tag: string) => boolean | undefined; // 浏览器因其容错机制会将某些嵌套标签给提出了，例如 <li><li></li></li> ====> <li></li><li></li>
  optimize?: boolean;

  /**
   * 是否保留空白字符，
   * 当在 html 文件中编写代码的时候，通常兄弟元素会进行换行操作，浏览器会将这个换行保存下来形成空白字符;
   * 例如： h1 与 h1 之间就存在空白换行符
   * <div id="app">
   *  <h1>1</h1>
   *  <h1>2</h1>
   *  <h1>3</h1>
   * <div>
   * */
  preserveWhitespace?: boolean; // 不传默认会进行保留
}

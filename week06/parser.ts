type Token = {
  type: string,
  tagName?:string,
  content?: string,
  isSelfClosing?:boolean,
}
type HTMLAttr = {
  name: string,
  value: string
}
interface Stack extends Token{
  attributes?: Array<HTMLAttr>
  children: Array<Stack>,
}

let currenToken:Token = null;
let currenAttribute:HTMLAttr= null;
let currentTextNode = null;
let stack = [{type: 'document', children: []}]

const EOF = Symbol('EOF');

function emit(token:Token) {
  let top:Stack = stack[stack.length - 1];

  if(token.type === 'startTage') {
    const ele:any = {
      type: 'element',
      children: [],
      attributes: []
    }

    ele.tagName = token.tagName;
 
    for(const p in token) {
      // @ts-ignore
      if(p!== 'type' || p!=='tagName') {
        ele.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(ele)

    if(!token.isSelfClosing) {
      stack.push(ele)
    }

    currentTextNode = null;
  }else if(token.type === 'endTag') {
    if(top.tagName !== token.tagName) {
       throw new Error('Tag start end does not match!');
    } else {
      stack.pop()
    }

    currentTextNode = null;
  }else if(token.type ==='text') {
    if(currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }

      top.children.push(currentTextNode)
    }

    currentTextNode.content+=token.content;
  }
}

function data(c:string) {
  if(c === '<') {
    return tagOpen
  } else if(c === EOF.toString()) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c:string) {
  if(c === '/') {
    return endTag
  }else if(c.match(/^[a-zA-Z]$/)) {
    currenToken = {
      type: 'startTag',
      tagName: ""
    }
    return tagName(c)
  }else {
    emit({
      type: 'text',
      content: c,
    })
    return;
  }
}

function endTag() {
  return EOF
}

function tagName(c:string) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  }else if(c === '/') {
    return selfClosingTag;
  }else if(c.match(/^[a-zA-Z]$/)) {
    currenToken.tagName = c
    return tagName
  }else if(c === '>') {
    emit(currenToken)
    return data;
  }else {
    currenToken.tagName += c
    return tagName;
  }
}

function beforeAttributeName(c:string) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  }else if(c === '>' || c === '/' || c === EOF.toString()) {
    return afterAttributeName;
  }else if(c === '='){
   return ; 
  }else {
    currenAttribute = {
      name: '',
      value: '',
    }

    return attributeName(c)
  }
}

function attributeName(c: string) {
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === EOF.toString()) {
    return attributeName(c)
  }else if(c === '=') {
    return beforeAttributeName
  }else if(c === '\u0000') {

  }else if(c === '\"' || c === "'" || c === '<'){
    
  }else {
    // @ts-ignore
    currenAttribute.name += c;
    return attributeName
  }
}

function beforeAttributeValue(c:string) {
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === EOF.toString()) {
    return beforeAttributeValue
  }else if(c === '\"'){
    return doubleQuotedAttributeValue;
  }else if(c === '\''){
    return singleQuotedAttributeValue;
  }else if(c === '>') {

  }else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c:string) {
  if(c ==='\"'){
    currenToken[currenAttribute.name] = currenAttribute.value;
  }else if(c === '\u0000'){

  }else {
    currenAttribute.value += c;
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c:string) {
  if(c === '\''){
    currenToken[currenAttribute.name] = currenAttribute.value;

    return afterQuotedAttributeValue
  }else if(c === '\u0000'){

  }else {
    currenAttribute.value += c;
    return doubleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c:string) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  }else if(c === '/') {
    return selfClosingTag
  }else if(c === '>') {
    currenToken[currenAttribute.name] = currenAttribute.value;
    emit(currenToken);
  }else if(c === EOF.toString()) {

  }else {
    currenAttribute.value += c;
    return doubleQuotedAttributeValue
  }
}

function unquotedAttributeValue(c:string) {
  if(c.match(/^[\t\n\f ]$/)) {
    currenToken[currenAttribute.name] = currenAttribute.value;
  }else if(c === '/') {
    currenToken[currenAttribute.name] = currenAttribute.value;
    return selfClosingTag
  }else if(c === '\u0000') {

  }else if(c === '\"' || c === "'" || c === '<' || c=== "=" || c==='`') {

  }else if(c === EOF.toString()) {

  }else {
    currenAttribute.value += c;
    return unquotedAttributeValue
  }
}

function selfClosingTag(c:string) {
  if(c === '>') {
    currenToken.isSelfClosing = true;
    emit(currenToken);
    return data;
  }else if(c === EOF.toString()) {

  }else {
  }
}

function endTagOpen(c:string) {
  if(c.match(/^[a-zA-Z]$/)) {
    currenToken = {
      type: 'endTag',
      tagName: ''
    }

    return tagName(c)
  }
}

function afterAttributeName(c:string) {
  if(c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  }else if(c === '/') {
    return selfClosingTag;
  }else if(c === '=') {
    return beforeAttributeValue
  }else if(c === '>') {
    currenToken[currenAttribute.name] = currenAttribute.value;
    emit(currenToken)
    
    return data
  }else if(c === EOF.toString()) {

  }else {
    currenToken[currenAttribute.name] = currenAttribute.value;
    currenAttribute = {
      name: '',
      value: ''
    }

    return afterAttributeName(c)
  }
}



const htmlstring = `
<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`

export function parseHTML(HTMLstring: string) {
  let state:any= data;
   for(const c of HTMLstring) {
     state = state(c)
   }
   state = state(EOF)
   return stack[0]
}
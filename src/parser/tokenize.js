const { inspect } = require('util')
const leadingWhitespacePattern = /^\s+/

function skipWhitespace(str) {
  const match = leadingWhitespacePattern.exec(str)
  if (match == null) {
    return str
  }

  return str.substr(match[0].length)
}

const Tokens = {
  isNone(tok) {
    return tok == null
  },

  none() {
    return null
  },

  openParen() {
    return {type: 'begin'}
  },

  isBegin(tok) {
    return tok.type === 'begin'
  },

  isEnd(tok) {
    return tok.type === 'end'
  },

  closeParen() {
    return {type: 'end'}
  },

  word(word) {
    return {type: 'word', data: word}
  },

  isWord(tok) {
    return tok.type === 'word'
  },

  invalid(str) {
    return {type: 'invalid', data: str}
  },

  isInvalid(tok) {
    return tok.type === 'invalid'
  },

  isValid(tok) {
    return !this.isNone(tok) && !this.isInvalid(tok)
  },

}

const Word = {
  getNext(str) {
    const re = /^[a-zA-Z0-9:.,%]+/
    const match = re.exec(str)
    if (match == null) {
      return null
    }

    return {word: match[0]}
  },

  isWord(word) {
    return word != null && 'word' in word
  },

  toString(word) {
    return word.word
  },

  length(word) {
    return word.word.length
  },

  isOperator(word) {
    return word.word === 'over'
  },
}

/**
 * @return array
 *     a pair consisting of the next token (or null, if none)
 *     and the remaining text after that token
 */
function getToken(_str) {
  const str = skipWhitespace(_str)
  if (str.length === 0) {
    return [Tokens.none(), '']
  }

  if (str.startsWith('(')) {
    return [Tokens.openParen(), str.substr(1)]
  }

  if (str.startsWith(')')) {
    return [Tokens.closeParen(), str.substr(1)]
  }

  const word = Word.getNext(str)
  if (Word.isWord(word)) {
    return [Tokens.word(word), str.substr(Word.length(word))]
  }

  return [Tokens.invalid(str), '']
}

function tokenize(str) {
  const tokens = []

  let text = str
  let tok

  while (text) {
    [tok, text] = getToken(text)

    if (Tokens.isValid(tok)) {
      tokens.push(tok)
    } else {
      throw new Error('invalid token')
    }
  }

  return tokens
}

function headAndTail(array) {
  if (!array.length) {
    throw new Error('head of empty array')
  }

  return [array[0], array.slice(1)]
}

function isTokenExpr(tok) {
  return Tokens.isWord(tok) && !Word.isOperator(tok.data)
}

function buildTree(tokens) {
  //console.log('DEBUG: buildTree', tokens)

  let lhs = null
  let rhs = null
  let op = null

  if (!tokens) {
    throw new Error('empty tree cannot be built')
  }

  let tail = tokens
  let head

  ;[head, tail] = headAndTail(tail)

  if (Tokens.isBegin(head)) {
    ;[lhs, tail] = buildTree(tail)

    if (!tail.length) {
      throw new Error('premature end (expected closing paren)')
    }

    ;[head, tail] = headAndTail(tail)

    if (!Tokens.isEnd(head)) {
      throw new Error('expected closing paren')
    }
  } else if (isTokenExpr(head)) {
    lhs = Word.toString(head.data)
  }

  if (!tail.length) {
    //console.log('END: by empty tail', inspect(lhs))
    return [lhs, []]
  } else if (Tokens.isEnd(tail[0])) {
    //console.log('END: by closing paren', inspect(lhs))
    return [lhs, tail]
  }

  ;[op, tail] = headAndTail(tail)
  if (!(Tokens.isWord(op) && Word.isOperator(op.data))) {
    throw new Error('operator at unexpected position')
  }

  //console.log('DEBUG: found op:', inspect(op), inspect(tail))
  op = Word.toString(op.data)

  //console.log('DEBUG: will call buildTree', inspect(tail))

  //console.log('DEBUG: before rhs:', inspect(rhs), inspect(tail))
  ;[rhs, tail] = buildTree(tail)
  //console.log('DEBUG: found rhs:', inspect(rhs), inspect(tail))

  if (rhs == null) {
    throw new Error(`null rhs (tail: ${inspect(tail)})`)
  }

  return [{
    op: op,
    lhs: lhs,
    rhs: rhs
  }, tail]

  //  let mid
  //  [mid, tail] = headAndTail(tail)
  //
  //  if (!Tokens.isWord(mid) || !Word.isOperator(mid.data)) {
  //    throw new Error('an operator was expected, got: ' + mid.type + ' ' + inspect(mid.data))
  //  }
  //
  //  op = Word.toString(mid)
  //
  //  let end
  //  [end, tail] = headAndTail(tail)
  //
  //  if (Tokens.isBegin(end)) {
  //    [rhs, tail] = buildTree(tail)
  //  } else if (Tokens.isWord(end)) {
  //
  //    if (Word.isOperator(end.data)) {
  //      throw new Error('operator at unexpected position')
  //    }
  //
  //    rhs = Word.toString(end)
  //  } else {
  //    throw new Error('unexpected token of type ' + end.type)
  //  }
  //
  //  let next
  //  [next, tail] = headAndTail(tail)
  //
  //  if (Tokens.isWord(next) && Word.isOperator(next.data)) {
  //
  //  }
  //
  //  if (!Tokens.isEnd(next)) {
  //    throw new Error('expected end, got ' + next.type)
  //  }
  //
  //  return [{
  //    op: op,
  //    lhs: lhs,
  //    rhs: rhs,
  //  }, tail]
}

function parseToTree(str) {
  const [tree, tail] = buildTree(tokenize(str))
  if (tail.length > 0) {
    throw new Error('extra tokens: ' + inspect(tail))
  }
  return tree
}

module.exports = {
  buildTree,
  parseToTree,
  tokenize,
}

#! /usr/bin/env coffee

fs = require 'fs'
{Brainfuck} = require "./brainfuck"

try
  c = 0
  ok = (name, l, r=true) ->
    c += 1
    if l is r
      console.log("#{name} -> ok")
    else
      console.log("#{name} -> not ok")
      console.log("### #{l}")
      console.log("### #{r}")

# type test
  bf = new Brainfuck()
  ok "instanceof", bf instanceof Brainfuck
  ok "syntax true", bf.syntax('[+[+[+]+]-]-[+]>[>]'), true
  ok "syntax false", bf.syntax('[++]-]'), false
  ret = bf.eval(".+.++.+++.---.")
  ok "result is Array", Array.isArray(ret)
  ok "result is number Array", typeof ret[0], 'number'
  ok "puts simple", ret.join(','), "0,1,3,6,3"

# eval test
  ok "shift", bf.eval(">>+++>+++++>.<<.>.").join(','), "0,3,5"
  ok "comment", bf.eval(">>+++>#foo\n+++#comment\n++>.<<.>.").join(','), "0,3,5"
  ok "ignore tab, space and line feed", bf.eval("+	+   +[>\n+ ++					<-].").join(','), "0"

# file read test
  Brainfuck.prototype.read = (path) ->
    data = fs.readFileSync path, 'utf-8'
    bf.eval(data, (a) -> String.fromCharCode(a))

  ret = bf.read "./hello.bf"
  ok "Hello World!", ret.join(''), "Hello World!"

# redefine test
  bf = new Brainfuck({
    '.':'p'
    '+':'a'
    '-':'m'
    '<':'l'
    '>':'g'
  })
  ok "redefine", bf.eval('aaapgaaammplmmp').join(','), "3,1,1"

# error test
  try
    ret = new Brainfuck().eval("<<<+++.")
  catch ex
    ok "can not use minus memory", ex.message, "can not use minus memory"

  try
    bf = new Brainfuck({'foo':'+'})
  catch ex
    ok "key redefine error", ex, "redefine error 'foo': can't set other then brainfuck char"

  try
    bf = new Brainfuck({'+': 'bar'})
  catch ex
    ok "value redefine error", ex, "redefine error 'bar': redefine can only one length char"

  ok "test count", c, 14

catch ex
  console.log(ex)

#! /usr/bin/env coffee

fs = require 'fs'
{Brainfuck} = require "./brainfuck.coffee"

try
  c = 0
  ok = (l, r=true) ->
    c += 1
    if l is r
      console.log("ok #{c}")
    else
      console.log("not ok #{c}")
      console.log("### left is #{l}")
      console.log("### right is #{r}")
  
  ret = Brainfuck(".+.++.+++.---.")
  ok Array.isArray(ret)
  ok typeof ret[0], 'number'
  ok ret.join(','), "0,1,3,6,3"
  
  ret = Brainfuck(">>+++>+++++>.<<.>.")
  ok ret.join(','), "0,3,5"
  ret = Brainfuck(">>+++>#foo\n+++#comment\n++>.<<.>.")
  ok ret.join(','), "0,3,5"
  ret = Brainfuck("<<<+++.")
  ok ret.join(','), "3"
  ret = Brainfuck("+	+   +[>\n+ ++					<-].")
  ok ret.join(','), "0"
  Brainfuck.read = (path) ->
    data = fs.readFileSync path, 'utf-8'
    Brainfuck(data)

  ret = Brainfuck.read "./hello.bf"
  ok ret.map((a) -> String.fromCharCode(a)).join(''), "Hello World!"

catch ex
  console.log(ex)

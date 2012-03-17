#! /usr/bin/env coffee

fs = require 'fs'
{Brainfuck} = require "./brainfuck"

try
  c = 0
  ok = (l, r=true) ->
    c += 1
    if l is r
      console.log("ok #{c}")
    else
      console.log("not ok #{c}")
      console.log("### left is #{l}")
      console.log("### left is #{r}")
  
  ret = Brainfuck(".+.++.+++.---.")
  ok Array.isArray(ret)
  ok typeof ret[0], 'number'
  ok ret.join(','), "0,1,3,6,3"
  
  ret = Brainfuck(">>+++>+++++>.<<.>.")
  ok ret.join(','), "0,3,5"
  ret = Brainfuck("<<<+++.")
  ok ret.join(','), "3"
  ret = Brainfuck("+++[>+++<-].")
  ok ret.join(','), "0"
  Brainfuck.read = (path) ->
    fs.readFile path, 'utf-8', (error, data) ->
      throw error if error
      Brainfuck(data)

  ret = Brainfuck.read "./hello.bf", (data) ->
    ok ret.map((a) -> String.fromCharCode(a)).join(''), "Hello World!"
catch ex
  console.log(ex)

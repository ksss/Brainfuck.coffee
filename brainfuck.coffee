###
# Brainfuck.coffee
# Author ksss (co000ri@gmail.com)
###
class Brainfuck
  constructor: (redefine) ->
    @set =
      '.': '.'
      '+': '+'
      '-': '-'
      '<': '<'
      '>': '>'
      '[': '['
      ']': ']'
    if redefine?
      for key, value of redefine
        unless @set[key]
          throw "redefine error \'#{key}\': can't set other then brainfuck char"
        unless value.length is 1
          throw "redefine error \'#{value}\': redefine can only one length char"
        @set[key] = value

  syntax: (src) ->
    at = 0
    depth = 0
    while ch = src.charAt(at)
      if ch is @set['[']
        depth += 1
      else if ch is @set[']']
        depth -= 1
      at += 1
    depth is 0

  eval: (src, callback) ->
    callback ?= (args) ->
      args
    src = src.replace(/#.*?\n/g, '')
    src = src.replace(/[\s\t\n]*/g, '')
    at = 0
    ch = src.charAt(0)
    memory = []
    index = 0
    result = []
    self = this

    error = (message = "error") ->
      throw {
        src: src
        set: self.set
        at: at
        ch: ch
        memory: memory
        index: index
        result: result
        charCodeAt: src.charCodeAt at
        message: message
      }

    next = ->
      at += 1
      ch = src.charAt at
    
    back = ->
      at -= 1
      ch = src.charAt at

    exec = ()->
      if index < 0
        error "can not use minus memory"
      memory[index] ?= 0

      switch ch
        when self.set['.'] then result.push callback(memory[index])
        when self.set['+'] then memory[index] += 1
        when self.set['-'] then memory[index] -= 1
        when self.set['>'] then index += 1
        when self.set['<'] then index -= 1
        when self.set['[']
          depth = 0
          if memory[index] is 0
            while next()
              if ch is self.set['[']
                depth += 1
              else if ch is self.set[']']
                if depth is 0
                  break
                depth -= 1
        when self.set[']']
          depth = 0
          if memory[index] isnt 0
            while back()
              if ch is self.set[']']
                depth += 1
              else if ch is self.set['[']
                if depth is 0
                  back()
                  break
                depth -= 1
        else
          error("No defined char")

      next()
      exec() if ch isnt ''
      result

    unless this.syntax src
      error("Syntax error")

    exec()

Brainfuck.varsion = "0.2.0"

this.Brainfuck = Brainfuck

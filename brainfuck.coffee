Brainfuck = (src) ->
  at = 0
  ch = src.charAt(0)
  memory = []
  index = 0
  result = []

  error = (message = "error") ->
    throw
      at: at
      ch: ch
      index: index
      memory: memory
      message: message

  next = ->
    at += 1
    ch = src.charAt(at)
  
  back = ->
    at -= 1
    ch = src.charAt(at)

  exec = ->
    memory[index] ?= 0
    
    switch ch
      when '.' then result.push memory[index]
      when '+' then memory[index] += 1
      when '-' then memory[index] -= 1
      when '>' then index += 1
      when '<' then index -= 1
      when '['
        depth = 0
        if memory[index] is 0
          while next()
            if ch is '['
              depth += 1
            else if ch is ']'
              if depth is 0
                break
              depth -= 1
      when ']'
        depth = 0
        if memory[index] isnt 0
          while back()
            if ch is ']'
              depth += 1
            else if ch is '['
              if depth is 0
                back()
                break
              depth -= 1
    next()
    exec() if ch isnt ''
    result
  exec()

this.Brainfuck = Brainfuck

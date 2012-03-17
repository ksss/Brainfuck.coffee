(function() {
  var Brainfuck;

  Brainfuck = function(src) {
    var at, back, ch, error, exec, index, memory, next, result;
    at = 0;
    ch = src.charAt(0);
    memory = [];
    index = 0;
    result = [];
    error = function(message) {
      if (message == null) message = "error";
      throw {
        at: at,
        ch: ch,
        index: index,
        memory: memory,
        message: message
      };
    };
    next = function() {
      at += 1;
      return ch = src.charAt(at);
    };
    back = function() {
      at -= 1;
      return ch = src.charAt(at);
    };
    exec = function() {
      var depth;
      if (memory[index] == null) memory[index] = 0;
      switch (ch) {
        case '.':
          result.push(memory[index]);
          break;
        case '+':
          memory[index] += 1;
          break;
        case '-':
          memory[index] -= 1;
          break;
        case '>':
          index += 1;
          break;
        case '<':
          index -= 1;
          break;
        case '[':
          depth = 0;
          if (memory[index] === 0) {
            while (next()) {
              if (ch === '[') {
                depth += 1;
              } else if (ch === ']') {
                if (depth === 0) break;
                depth -= 1;
              }
            }
          }
          break;
        case ']':
          depth = 0;
          if (memory[index] !== 0) {
            while (back()) {
              if (ch === ']') {
                depth += 1;
              } else if (ch === '[') {
                if (depth === 0) {
                  back();
                  break;
                }
                depth -= 1;
              }
            }
          }
      }
      next();
      if (ch !== '') exec();
      return result;
    };
    return exec();
  };

  this.Brainfuck = Brainfuck;

}).call(this);

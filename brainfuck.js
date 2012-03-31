
/*
# Brainfuck.coffee
# Author ksss (co000ri@gmail.com)
*/

(function() {
  var Brainfuck;

  Brainfuck = (function() {

    function Brainfuck(redefine) {
      var key, value;
      this.set = {
        '.': '.',
        '+': '+',
        '-': '-',
        '<': '<',
        '>': '>',
        '[': '[',
        ']': ']'
      };
      if (redefine != null) {
        for (key in redefine) {
          value = redefine[key];
          if (!this.set[key]) {
            throw "redefine error \'" + key + "\': can't set other then brainfuck char";
          }
          if (value.length !== 1) {
            throw "redefine error \'" + value + "\': redefine can only one length char";
          }
          this.set[key] = value;
        }
      }
    }

    Brainfuck.prototype.syntax = function(src) {
      var at, ch, depth;
      at = 0;
      depth = 0;
      while (ch = src.charAt(at)) {
        if (ch === this.set['[']) {
          depth += 1;
        } else if (ch === this.set[']']) {
          depth -= 1;
        }
        at += 1;
      }
      return depth === 0;
    };

    Brainfuck.prototype.eval = function(src, callback) {
      var at, back, ch, error, exec, index, memory, next, result, self;
      if (callback == null) {
        callback = function(args) {
          return args;
        };
      }
      src = src.replace(/#.*?\n/g, '');
      src = src.replace(/[\s\t\n]*/g, '');
      at = 0;
      ch = src.charAt(0);
      memory = [];
      index = 0;
      result = [];
      self = this;
      error = function(message) {
        if (message == null) message = "error";
        throw {
          src: src,
          set: self.set,
          at: at,
          ch: ch,
          memory: memory,
          index: index,
          result: result,
          charCodeAt: src.charCodeAt(at),
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
        if (index < 0) error("can not use minus memory");
        if (memory[index] == null) memory[index] = 0;
        switch (ch) {
          case self.set['.']:
            result.push(callback(memory[index]));
            break;
          case self.set['+']:
            memory[index] += 1;
            break;
          case self.set['-']:
            memory[index] -= 1;
            break;
          case self.set['>']:
            index += 1;
            break;
          case self.set['<']:
            index -= 1;
            break;
          case self.set['[']:
            depth = 0;
            if (memory[index] === 0) {
              while (next()) {
                if (ch === self.set['[']) {
                  depth += 1;
                } else if (ch === self.set[']']) {
                  if (depth === 0) break;
                  depth -= 1;
                }
              }
            }
            break;
          case self.set[']']:
            depth = 0;
            if (memory[index] !== 0) {
              while (back()) {
                if (ch === self.set[']']) {
                  depth += 1;
                } else if (ch === self.set['[']) {
                  if (depth === 0) {
                    back();
                    break;
                  }
                  depth -= 1;
                }
              }
            }
            break;
          default:
            error("No defined char");
        }
        next();
        if (ch !== '') exec();
        return result;
      };
      if (!this.syntax(src)) error("Syntax error");
      return exec();
    };

    return Brainfuck;

  })();

  Brainfuck.varsion = "0.2.0";

  this.Brainfuck = Brainfuck;

}).call(this);

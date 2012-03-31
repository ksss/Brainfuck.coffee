(function() {
  var Brainfuck, bf, c, fs, ok, ret;

  fs = require('fs');

  Brainfuck = require("./brainfuck").Brainfuck;

  try {
    c = 0;
    ok = function(name, l, r) {
      if (r == null) r = true;
      c += 1;
      if (l === r) {
        return console.log("" + name + " -> ok");
      } else {
        console.log("" + name + " -> not ok");
        console.log("### " + l);
        return console.log("### " + r);
      }
    };
    bf = new Brainfuck();
    ok("instanceof", bf instanceof Brainfuck);
    ok("syntax true", bf.syntax('[+[+[+]+]-]-[+]>[>]'), true);
    ok("syntax false", bf.syntax('[++]-]'), false);
    ret = bf.eval(".+.++.+++.---.");
    ok("result is Array", Array.isArray(ret));
    ok("result is number Array", typeof ret[0], 'number');
    ok("puts simple", ret.join(','), "0,1,3,6,3");
    ok("shift", bf.eval(">>+++>+++++>.<<.>.").join(','), "0,3,5");
    ok("comment", bf.eval(">>+++>#foo\n+++#comment\n++>.<<.>.").join(','), "0,3,5");
    ok("ignore tab, space and line feed", bf.eval("+	+   +[>\n+ ++					<-].").join(','), "0");
    Brainfuck.prototype.read = function(path) {
      var data;
      data = fs.readFileSync(path, 'utf-8');
      return bf.eval(data, function(a) {
        return String.fromCharCode(a);
      });
    };
    ret = bf.read("./hello.bf");
    ok("Hello World!", ret.join(''), "Hello World!");
    bf = new Brainfuck({
      '.': 'p',
      '+': 'a',
      '-': 'm',
      '<': 'l',
      '>': 'g'
    });
    ok("redefine", bf.eval('aaapgaaammplmmp').join(','), "3,1,1");
    try {
      ret = new Brainfuck().eval("<<<+++.");
    } catch (ex) {
      ok("can not use minus memory", ex.message, "can not use minus memory");
    }
    try {
      bf = new Brainfuck({
        'foo': '+'
      });
    } catch (ex) {
      ok("key redefine error", ex, "redefine error 'foo': can't set other then brainfuck char");
    }
    try {
      bf = new Brainfuck({
        '+': 'bar'
      });
    } catch (ex) {
      ok("value redefine error", ex, "redefine error 'bar': redefine can only one length char");
    }
    ok("test count", c, 14);
  } catch (ex) {
    console.log(ex);
  }

}).call(this);

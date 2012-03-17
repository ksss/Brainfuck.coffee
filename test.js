(function() {
  var Brainfuck, c, fs, ok, ret;

  fs = require('fs');

  Brainfuck = require("./brainfuck.coffee").Brainfuck;

  try {
    c = 0;
    ok = function(l, r) {
      if (r == null) r = true;
      c += 1;
      if (l === r) {
        return console.log("ok " + c);
      } else {
        console.log("not ok " + c);
        console.log("### left is " + l);
        return console.log("### right is " + r);
      }
    };
    ret = Brainfuck(".+.++.+++.---.");
    ok(Array.isArray(ret));
    ok(typeof ret[0], 'number');
    ok(ret.join(','), "0,1,3,6,3");
    ret = Brainfuck(">>+++>+++++>.<<.>.");
    ok(ret.join(','), "0,3,5");
    ret = Brainfuck(">>+++>#foo\n+++#comment\n++>.<<.>.");
    ok(ret.join(','), "0,3,5");
    ret = Brainfuck("<<<+++.");
    ok(ret.join(','), "3");
    ret = Brainfuck("+	+   +[>\n+ ++					<-].");
    ok(ret.join(','), "0");
    Brainfuck.read = function(path) {
      var data;
      data = fs.readFileSync(path, 'utf-8');
      return Brainfuck(data);
    };
    ret = Brainfuck.read("./hello.bf");
    ok(ret.map(function(a) {
      return String.fromCharCode(a);
    }).join(''), "Hello World!");
  } catch (ex) {
    console.log(ex);
  }

}).call(this);

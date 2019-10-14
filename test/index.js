const test = require('tape')
const { Traits } = require('../traits')

test('merges multiple traits', t => {
  var A = function() { this.fooVar = 'foo'; };
  A.prototype.foo = function() { return 'foo'; };

  var B = function() { this.barVar = 'bar'; };
  B.prototype.bar = function() { return 'bar'; };

  var C = function() { this.bazVar = 'baz'; };
  C.prototype.baz = function() { return 'baz'; };

  var D = Traits.compose(
    function() {
      Traits.init(this)
    },
    [A, B, C]
  )

  var inst = new D()
  t.equal('foo', inst.foo())
  t.equal('bar', inst.bar())
  t.equal('baz', inst.baz())

  t.end()
})

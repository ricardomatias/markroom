

var mdast = require('mdast');

console.log(mdast.process('*hello* __world__')); // _hello_ **world**


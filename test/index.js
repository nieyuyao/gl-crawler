const expect = require("chai").expect;

function sayHello() {
    return 'hello';
}

describe('this is test', function() {
    it('say hello', function(done) {
        const msg = sayHello();
        expect(msg).to.equal('hello');
        done();
    });
});
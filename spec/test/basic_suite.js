/* eslint-disable no-constant-condition */
'use strict';

describe('test', () => {
    let bar,
        foo = {};

    describe('foo', () => {
        describe('foo' + bar, () => {
            it('should foo' + bar, () => {
            });
        });

        describe('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {
            it('should hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {
            });
        });

        describe('baz' + foo.bar + foo['quux'], () => {
            it('should baz' + foo.bar + foo['quux'], () => {
            });
        });

        describe(typeof '', () => {
            it('should ' + typeof '', () => {
            });
        });
    });
});

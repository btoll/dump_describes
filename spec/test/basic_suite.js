/* eslint-disable brace-style, no-constant-condition, no-unused-vars */
'use strict';

describe('test', () => {
    const foo = {};
    const quux = () => {};
    let bar;
    let baz;

    describe('foo', () => {
        describe(baz = bar, () =>
            it('should ' + (baz = bar), () => {})
        );

        describe(baz = function () {}, () =>
            it('should ' + function () {}, () => {})
        );

        describe(function () {}, () =>
            it(function () {}, () => {})
        );

        describe(() => { const x = 5; }, () =>
            it(() => {}, () => {})
        );

        describe('foo' + bar, () =>
            it('should foo' + bar, () => {})
        );

        describe('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () =>
            it('should hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {})
        );

        describe('baz' + foo.bar + foo['quux'], () =>
            it('should baz' + foo.bar + foo['quux'], () => {})
        );

        describe(typeof '', () =>
            it('should ' + typeof '', () => {})
        );

        describe(`baz ${foo.bar}`, () =>
            it(`baz ${foo.bar}`, () => {})
        );

        describe(quux() + 'baz ' + foo('derp').bar(), () =>
            it(quux() + 'baz ' + foo('derp').bar(), () => {})
        );
    });
});


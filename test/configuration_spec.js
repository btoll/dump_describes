'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;

    beforeAll(() => {
        onfStatic.setDebugLevel('NONE');

        onfStatic.setOptions({
            generator: {
                log: generator
            },
            type: 'log',
            useMap: false,
            verbose: false,
            visitor: dumpDescribesVisitor.refs
        });

        dumpDescribesVisitor.setOptions({
            active: false,
            inactive: false,
            verbose: false
        });
    });

    describe('configuration', () => {
        describe('onf-static options', () => {
            it('should use the specified generator', () => {
                expect(onfStatic.getOptions().generator.log).toEqual(generator);
            });

            it('should use the specified visitor', () => {
                expect(onfStatic.getOptions().visitor).toEqual(dumpDescribesVisitor.refs);
            });

            it('should not throw if not given a generator or visitor (will use the defaults)', () => {
                expect(() => {
                    dumpDescribes('() => {}', true);
                }).not.toThrow();
            });
        });

        describe('visitor options', () => {
            function testVisitorOptions(prop) {
                it('should be off by default', () => {
                    expect(dumpDescribesVisitor.getOptions()[prop]).toBe(false);
                });

                it('should be `true` when set', () => {
                    dumpDescribesVisitor.setOptions({
                        [prop]: true
                    });

                    expect(dumpDescribesVisitor.getOptions()[prop]).toBe(true);
                });
            }

            describe('active', () => {
                testVisitorOptions('active');
            });

            describe('inactive', () => {
                testVisitorOptions('inactive');
            });

            describe('verbose', () => {
                testVisitorOptions('verbose');
            });
        });
    });
});


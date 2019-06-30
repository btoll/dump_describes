(() => {
    return describe('transpiled', () => {
        describe('when foo', () => {
            it('should derp', () => {
                expect(2 + 2).toBe(4);
            });
        });

        return describe('when bar', () => {
            it('should herp', () => {
                expect([1, 2, 4].length).toBe(3);
            });

            return it('should double derp', () => {
                expect({}).not.toBe({});
            });
        });
    });
});


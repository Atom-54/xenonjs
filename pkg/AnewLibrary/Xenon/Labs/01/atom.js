export const atom = (log, html, resolve) => ({
  template: `foo`,
  async update(inputs, state, {service}) {
    log('Atom lives');
    await service('Foo', 'FooFoo', {foo: 42});
    return {foo: 3};
  }
});
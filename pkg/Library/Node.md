# Nodes

The `Node` is a specification that defines how the referenced `Atom`(s) will be reified.   
  

## Specs

A `Node` may consist of one or more `Atoms`. For each `Atom`, it provides the following information:
* `type`: the path from which the `Atom`'s implementation is served
* `inputs` and `outputs`: _[optional]_ lists of input and output names respectively; the combined `inputs` and `outputs` constitute the `Node`'s interface to the rest of the system
* `bindings`: _[optional]_ mappings between inputs and outputs of `Atoms` in this `Node`
* `container`: _[optional]_ an identifier of a slot in which this `Atom`'s UI is to be rendered

In addition, a `Node` may contain `state`, which is a map from `Atoms`' input key to a data value.

## Examples

### inputs
This `Node` consists of a `Greeting` atom that takes a _"name"_ as an `input` and, presumably, renders a greeting:
```
export const GreetingNode = {
  greeting: {
    type: '$myLibrary/Greeting'
    inputs: ['name']
  }
};
```
The `Atom` could look something like:
```
({
  template: `
    <div>
      Hello
      <span>{{name}}</span>
    </div>
  `
});
```

The `Node` doesn't need to _know_ the details of the `Atom` implementation, its role is to declare the `inputs` and `outputs` channels:
* if the `Node` provides `input`(s) the `Atom` doesn't expect, they'll be ignored; 
* if an `Atom` accepts `inputs` that the `Node` doesn't provide, they will remain undefined;
* if an `Atom` provides `output`(s) that isn't specified in the `Node` it will be ignored;
  
Therefore, the _"Greeting"_ `Atom` above could also be implemented differently:

```
({
  update({hello, name}, state) {
    state.greeting = `${greeting ?? 'Hello'}${name.toUpperCase()}`;
    return {
      greeting: state.greeting
    }
  },
  template: `<div>{{greeting}}</div>`
});
```
This `Atom`'s implementation has an additional _"hello"_ input. The `Node` example above doesn't provide this input, so a default value will be used. However a different `Node` declaration could provide a _"hello"_ in a different language, and the same `Atom` would behave accordingly.

### outputs
For example:
```
const RandomNumberNode = {
  generator: {
    type: '$myLibrary/RandomNumberGenerator',
    outputs: ['number']
  }
}
```

The following `Node` references a random number generator `Atom` and outputs a random number.

### bindings

Here is an example of a `Node` that consists of 2 `Atoms` that are bound by their input and output.  
_Reminder_: Atoms cannot communicate with each other directly, only via data flow.

```
const FunNode = {
  generator: {
    type: '$myLibrary/RandomNumberGenerator',
    outputs: ['number'] 
  },
  puppiesRenderer: {
    type: $myLibrary/PuppiesRenderer',
    bindings: {
      count: 'generator$number'
    }
  }
}
```

In this example, there is a `Node` with a random number generator `Atom`, similarly to above. In addition, this `Node` also uses a _"PuppiesRenderer"_ atom, that binds to the random number generator's output to render the apropriate number of puppies.


**Note**: Similarly to how `bindings` are used to connect an output of one `Atom` to an input of another, the `inputs` and `outputs` of `Atom`s in a `Node` can be used to connect this `Node` to other `Node`s in a [`Graph`](./README.md#graphs).

### state

A most common example, probabaly, is for `Node` to declare both `inputs` and `outputs`. This example `Node` can be used to calculate the sum of 2 numbers, using a special _"Sum"_ `Atom`:
```
const SumNode = {
  sum: {
    type: '$myLibrary/Sum',
    inputs: ['num1', 'num2'],
    outputs: ['sum']
  }
}
```

 If however we wanted to use a general purpose _"ArithmeticOperation"_ `Atom`, we could specify the `Node` as following:

```
const SumNode = {
  sum: {
    type: '$myLibrary/ArithmeticOperation',
    inputs: ['operand1', 'operand2', 'operator'],
    outputs: ['result']
  },
  state: {
    sum$operator: '+'
  }
}
```
The _"operator"_ `input` will be set to the data value provided by the corresponding mapping value in `state`.

## Summary

The decoupling of declaration (i.e. `Node`) and implementation (i.e. `Atom`(s)) provides for extra flexibility and composability. The low level implementation is treated as black box with a certain shape. This allows the creation of a wide variety of semantic units by simple configuration. The ability to combine general-purpose `Atom`s in different ways enables and promotes reuse.

# flat-transform

### A small library tranforming your flat objects into rich ones using declarative rules.

```javascript
var transform = require("flat-transform").transform.filter

var object = {
  username: "John Doe",
  phone_country_code: "+420",
  phone_number: "123 456 789"
}

var rules = {
  username: "username",
  phone: {
    country_code: "phone_country_code",
    number: "phone_number"
  }
}

var output = transform(rules, object)

// {
//   username: "John Doe",
//   phone: {
//     country_code: "+420",
//     number: "123 456 789"
//   }
// }
```
## Installation

```javascript
npm install flat-transform --save
```

## Use cases
Relational databases usually return flat row objects. The goal of an arbitrary API is to present data in a structured form.

This library's goal is to transform this flat relation into a structured object simply by declaring the output structure with matching property names of the original relation.

Function can also be used for creating new properties. The arguments of the function should correspond with the properties of the original object.

## API

### transform.filter(rules[, exceptions], object)
Transforms original `object` into the new one, which is defined by `rules`. It ommits original fields (the ones not in the `rules` object) in the new object.

The array of `exceptions` can be used, each item in the `exceptions` array is a function.

### transform.preserve(rules[, exceptions], object)
Transforms original `object` into the new one, which is defined by `rules`. It preserves original fields (the ones not in the `rules` object) in the new object.

The array of `exceptions` can be used, each item in the `exceptions` array is a function.

## Declaration of the rules

The `rules` object is the declaration of the output and its connection to the original object.

```javascript
var object = { username: "John Doe" }  

var rules = {
  user: {
    name: "username"
  }
}

// { user: { name: "John Doe" } }
```

Each key of the `rules` object is the declaration, each value is the connection.

The values of the `rules` object can be either strings, functions or objects.

Any `String` value of the `rules` object is the connection to the key of the original `object`.

```javascript
var object = { username: "John Doe" }

var rules = {
  is_john_doe: function (username) { return username == "John Doe" ? true : false }
}

// { is_john_doe: true }
```
Any `Function` value of the `rules` object is evaluated and arguments of the function are the connection to the matching keys of the original `object`.

## Using the `exceptions` array

Often, the existence of certain keys on the outputting object may depend on the content of the original `object`.

```javascript
{
  username: "John Doe",
  email: null
}

var rules = {
  user: {
    username: "username",
    email: "email"
  }
}

var exceptions = [ function (email) { return email == null ? "email" : null } ]

var output = transform(rules, exceptions, object)
// { 
//   user: {
//     username: "John Doe"  
//   }
// }
```

Each `Function` in the `exceptions` array is evaluated and arguments of the function are the connection to the matching keys of the original `object`. The output is expected to be either `String` or null. The `String` output is defining which key in the `rules` object is to be ignored.


## Applying the transformation on the array of objects

You can use `map` to apply the transformation function. The `rules` (and `exceptions` is needed) can be bound by the `bind` function (partial application).

```javascript
var objects = [
  { username: "John Doe" },
  { username: "Brad Pitt" },
  { username: "Angelina Jolie" }
]

var rules = {
  is_john_doe: function (username) { return username == "John Doe" ? true : false }
}

var output = objects.map(transform.bind(this, rules))
// var objects = [
//   { is_john_doe: true },
//   { is_john_doe: false },
//   { is_john_doe: false }
// ]
```

## Examples

```javascript
var flat = require("flat-transform")

var obj = {
  message: "Hello",
  username: "John Doe",
  user_id: 1,
  phone_country_code: "+420",
  phone_number: "123 456 789",
  swag: true
}

var rules = {
  user: {
    id: "user_id",
    username: "username",
    phone: {
      country_code: "phone_country_code",
      number: { stringified: "phone_number" },
    },
    wot: function (user_id, swag) { return user_id && swag ? "such swag" : ":(" }
  },
  phone1: "phone_number",
  phone2: "phone_number",
  phone3: "phone_number",
  phone4: "phone_number"
}

var transformed = flat.transform.filter(rules, obj)

/*
{
  user: { 
    id: 1,
    username: "John Doe",
    phone: { 
      country_code: "+420" 
      number: { stringified: "123 456 789" }
    },
    wot: "such swag"
  },
  phone1: "123 456 789",
  phone2: "123 456 789",
  phone3: "123 456 789",
  phone4: "123 456 789"
}
*/

var transformed = flat.transform.preserve(rules, obj)

/*
{
  user: { 
    id: 1,
    username: "John Doe",
    phone: { 
      country_code: "+420" 
      number: { stringified: "123 456 789" }
    },
    wot: "such swag"
  },
  phone1: "123 456 789",
  phone2: "123 456 789",
  phone3: "123 456 789",
  phone4: "123 456 789",
  message: "Hello"
}
*/
```

## License

MIT
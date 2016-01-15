# flat-transform

### A small library tranforming your flat objects into rich ones using declarative rules.

## Installation

```javascript
npm install flat-transform --save
```

## Use cases
Relational databases usually return flat row objects. The goal of an arbitrary API is to present data in a structured form.

This library's goal is to transform this flat relation into a structured object simply by declaring the output structure with matching property names of the original relation.

Function can also be used for creating new properties. The arguments of the function should correspond with the properties of the original object.

## API

### transform.filter(rules, original)
Transforms original object into the new one, which is defined by rules. It ommits original fields (the ones not in the rules object) in the new object.

### transform.preserve(rules, original)
Transforms original object into the new one, which is defined by rules. It preserves original fields (the ones not in the rules object) in the new object.


## Example

```javascript
var flat = require("flat-transform")

var obj = {
  message: "Hello",
  username: "John Doe",
  user_id: 1,
  phone_country_code: "+420",
  phone_number: "123 456 789"
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
var flat = require("../lib/transform.js")

var obj = {
	message: "Hello",
	username: "John Doe",
	user_id: 1,
	is_retweeted: false,
	retweeted_status_id: null,
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
			number: { stringified: "phone_number" }
		},
		wot: function (user_id, swag) { return user_id && swag ? "such swag" : ":(" }
	},
	retweeted_status: {
		id: "retweeted_status_id"
	},
	phone1: "phone_number",
	phone2: "phone_number",
	phone3: "phone_number",
	phone4: "phone_number"
}

var blacklist_exceptions = [ function (is_retweeted) { return !is_retweeted ? "retweeted_status" : null } ]

console.log('\033[0;31mFiltered attributes\033[0m');
var transformed = flat.transform.filter(rules, blacklist_exceptions, obj)
console.log(JSON.stringify(transformed, null, 2))

console.log('\n\033[0;31mPreserved attributes\033[0m');
var transformed = flat.transform.preserve(rules, blacklist_exceptions, obj)
console.log(JSON.stringify(transformed, null, 2).replace(/("swag": true)/, "\033[0;32m$1\033[0m").replace(/("message": "Hello")/, "\033[0;32m$1\033[0m"))
var flat = require("./lib/transform.js")

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
			number: { stringified: "phone_number" }
		}
	},
	phone1: "phone_number",
	phone2: "phone_number",
	phone3: "phone_number",
	phone4: "phone_number"
}

var transformed = flat.transform(rules, obj)

console.log(transformed)
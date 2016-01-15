var _ = require("lodash")

var transform_sub = function (rules, new_object, orig_object) { 
	var sub_object = {}

	var new_properties = Object.keys(rules)

	_.each(new_properties, function (new_property) {

		if (rules[new_property].constructor === Object) {
			
			sub_object[new_property] = transform_sub(rules[new_property], new_object, orig_object)

		} else if (rules[new_property].constructor === Function) {

			var parameters = rules[new_property].toString().match(/\((.*)\)/)[1].split(",")
			var args = parameters.map(function (param) { return orig_object[param.trim()] })

			sub_object[new_property] = rules[new_property].apply(this, args)
			delete new_object[rules[new_property]]

		} else {

			sub_object[new_property] = orig_object[rules[new_property]]
			delete new_object[rules[new_property]]

		}

	})

	return sub_object
}

exports.transform = {}

exports.transform.preserve = function (rules, object) {
	var new_object = _.clone(object)
	return _.extend(transform_sub(rules, new_object, object), new_object)
}

exports.transform.filter = function (rules, object) {
	var new_object = _.clone(object)
	return _.extend(transform_sub(rules, new_object, object), {})
}
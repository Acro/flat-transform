var _ = require("lodash")

var transform_sub = function (rules, new_object, orig_object) { 
	var sub_object = {}

	var new_properties = Object.keys(rules)

	_.each(new_properties, function (new_property) {
		if (typeof rules[new_property] == "object") {
			sub_object[new_property] = transform_sub(rules[new_property], new_object, orig_object)
		} else {
			sub_object[new_property] = orig_object[rules[new_property]]
			delete new_object[rules[new_property]]
		}
	})

	return sub_object
}

exports.transform = function (rules, object) { 
	var new_object = _.clone(object)
	return _.extend(transform_sub(rules, new_object, object), new_object)
}
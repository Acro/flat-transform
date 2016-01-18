var _ = require("lodash")

var transform_sub = function (rules, property_blacklist, new_object, orig_object) { 

	var sub_object = {}

	var new_properties = Object.keys(rules).filter(function (property) { return property_blacklist.indexOf(property) == -1 })

	_.each(new_properties, function (new_property) {

		if (rules[new_property].constructor === Object) {
			
			sub_object[new_property] = transform_sub(rules[new_property], property_blacklist, new_object, orig_object)

		} else if (rules[new_property].constructor === Function) {

			var parameters = rules[new_property].toString().match(/\((.*?)\)/)[1].split(",")
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

var construct_blacklist = function (exceptions, orig_object) {

	var property_blacklist = []

	_.each(exceptions, function (exception_func) {

		if (exception_func.constructor !== Function) {
			return
		}

		var parameters = exception_func.toString().match(/\((.*?)\)/)[1].split(",")
		var args = parameters.map(function (param) { return orig_object[param.trim()] })

		property_blacklist.push( exception_func.apply(this, args) )

	})

	return property_blacklist

}

exports.transform = {}

exports.transform.preserve = function (rules, exceptions, object) {

	var orig_object = typeof object == "object" ? object : exceptions
	var new_object = _.clone(orig_object)
	var property_blacklist = []

	if (object && typeof object == "object") {
		property_blacklist = construct_blacklist(exceptions, orig_object)
	}

	return _.extend(transform_sub(rules, property_blacklist, new_object, orig_object), new_object)

}

exports.transform.filter = function (rules, exceptions, object) {

	var orig_object = typeof object == "object" ? object : exceptions
	var new_object = _.clone(orig_object)
	var property_blacklist = []

	if (object && typeof object == "object") {
		property_blacklist = construct_blacklist(exceptions, orig_object)
	}

	return _.extend(transform_sub(rules, property_blacklist, new_object, orig_object), {})

}
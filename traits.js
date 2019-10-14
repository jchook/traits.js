// traits.js
// by Wes Roberts <me@jchook.com>
;(function(exports){

	var extend = function(target, more, override) {
		if (target && more) for (var i in more)
			if (more.hasOwnProperty(i) && (i !== 'prototype') && (i !== '__traits__'))
				if ((typeof target[i] === 'undefined') || (more[i] !== Traits.required))
					target[i] = (override || (typeof target[i] === 'undefined')) ? more[i] : Traits.conflict;
		return target;
	};

	var validate = function() {
		for (var x=0, l=arguments.length; x<l; x++)
			for (var y in arguments[x])
				if ((arguments[x][y] == Traits.conflict) || (arguments[x][y] == Traits.required))
						arguments[x][y].call(arguments[x], y);
	};

	var Traits = extend(function(){ Traits.init(this, arguments); }, {
		init: function(obj, args, traits) {
			for (var i=0, l=(traits = (traits || obj.constructor.__traits__ || [])).length; i<l; i++) {
				traits[i].apply(this, arguments);
			}
		},
		compose: function (obj, traits, resolution) {
			obj.__traits__ || Object.defineProperty(obj, '__traits__', {value: []});
			Array.prototype.push.apply(obj.__traits__, traits);
			for (var i=0, l=traits.length; i<l; i++)
				extend(extend(obj, traits[i]).prototype, traits[i].prototype);
			if (resolution)
				extend(extend(obj, resolution, true).prototype, resolution.prototype, true);
			validate(obj, obj.prototype);
			return obj;
		},
		conflict: function(prop, obj){ throw new Error('Conflicting property name: ' + prop); },
		required: function(prop, obj){ throw new Error('Missing required property: ' + prop); }
	});

	exports.Traits = Traits;

})(exports || this);
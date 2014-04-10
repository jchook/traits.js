// traits.js
// by Wes Roberts <me@jchook.com>
//
;(function(exports){

	var extend = function(target, more, override) {
		if (target && more) for (var i in more)
			if (more.hasOwnProperty(i) && (i !== 'prototype'))
				if ((typeof target[i] === 'undefined') || (more[i] !== Trait.required))
					target[i] = (override || (typeof target[i] === 'undefined')) ? more[i] : Trait.conflict;
		return target;
	};

	var validate = function(obj) {
		if (obj) for (var i in obj) 
			if (obj.hasOwnProperty(i) && (i !== 'prototype')) 
				if ((obj[i] == Trait.conflict) || (obj[i] == Trait.required))
					obj[i].call(obj, i);
	};

	var Trait = extend(function(){}, {
		compose: function (obj, traits, resolution) {
			(obj.traits || (obj.traits = [])).push.apply(obj.traits, traits);
			for (var i=0, l=traits.length; i<l; i++) {
				extend(obj, traits[i]);
				extend(obj.prototype, traits[i].prototype);
			}
			if (resolution) {
				extend(obj, resolution, true);
				extend(obj.prototype, resolution.prototype || {}, true);
			}
			validate(obj)
			validate(obj.prototype);
			return obj;
		},
		conflict: function(prop, obj){ throw new Error('Conflicting property name: ' + prop); },
		required: function(prop, obj){ throw new Error('Missing required property: ' + prop); }
	});
 
	exports.Trait = Trait;

})(exports || this);
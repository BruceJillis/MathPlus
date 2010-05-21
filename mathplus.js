/*
 * By Peter Robinett, peter@bubblefoundry.com
 * A better mathematics library for Javascript.
 */

var MP = {
  // Created 1997 by Brian Risk.  http://brianrisk.com
  // from http://www.geneffects.com/briarskin/programming/newJSMathFuncs.html
  'log': function log(x, base) {
  	if (typeof base != "number" && !(base instanceof Number)) {
    	base = 10;
  	}
  	return (Math.log(x) / Math.log(base));
  },
  // Created 1997 by Brian Risk.  http://brianrisk.com
  // from http://www.geneffects.com/briarskin/programming/newJSMathFuncs.html
  'round': function round(x, places) {
    if (typeof places != "number" && !(places instanceof Number)) {
    	places = 2;
  	}
    return (Math.round(x * Math.pow(10, places)) / Math.pow(10,places));
  },
  // Created 1997 by Brian Risk.  http://brianrisk.com
  // from http://www.geneffects.com/briarskin/programming/newJSMathFuncs.html
  'approximateFraction': function approximateFraction(x, maxDenominator) {
  	maxDenominator = parseInt(maxDenominator);
  	if (typeof maxDenominator != "number" && !(maxDenominator instanceof Number)) {
    	maxDenominator = 16;
  	}
  	var approx = 0;
  	var error = 0;
  	var best = 0;
  	var besterror = 0;
  	for (var i = 1; i <= maxDenominator; i++) {
  		approx = Math.round(x / (1 / i));
  		error = (x - (approx / i))
  		if (i==1) {
    		best = i;
    		besterror = error;
  		}
  		if (Math.abs(error) < Math.abs(besterror)) {
    		best = i;
    		besterror = error;
  		}
  	}
  	
  	// return x/1 instead of 0/0 if a better solution can't be found
  	var solution = (Math.round(x / (1 / best)) + "/" + best)
  	if (solution == "0/0") {
    	solution = x + "/" + 1
  	}
  	return solution;
  },
  // Created 1997 by Brian Risk.  http://brianrisk.com
  // from http://www.geneffects.com/briarskin/programming/newJSMathFuncs.html
  'convertBase': function convertBase (number, ob, nb) {
  	number = number.toUpperCase();
  	var list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  	var dec = 0;
  	for (var i = 0; i <=  number.length; i++) {
  		dec += (list.indexOf(number.charAt(i)) * Math.pow(ob, (number.length - i - 1)));
  	}
  	number = "";
  	var magnitude = Math.floor(Math.log(dec) / Math.log(nb));
  	for (var i = magnitude; i >= 0; i--) {
  		var amount = Math.floor(dec / Math.pow(nb, i));
  		number = number + list.charAt(amount);
  		dec -= amount * Math.pow(nb, i);
  	}
  	return number;
  },
  'ln': function(x) {
    return Math.log(x);
  },
  'toDegrees': function toDegrees(radians) {
    return (radians / (Math.PI / 180));
  },
  'toRadians': function toRadians(degrees) {
    return (degrees * (Math.PI / 180));
  },
  'random': function random(rangeStart, rangeEnd) {
    // if there's no difference between the two points
    if (rangeStart == rangeEnd) {
      // throw new Error("The start and end points of the range in which the random number is to be found are the same, meaning that no random number can be generated.");
      return rangeStart;
    }
    if (typeof rangeStart != "number" && !(rangeStart instanceof Number)) {
    	rangeStart = 0;
  	}
  	if (typeof rangeEnd != "number" && !(rangeEnd instanceof Number)) {
    	rangeEnd = 1;
  	}
  	// make sure rangeEnd > rangeStart
  	if (rangeEnd < rangeStart) {
    	var tmp = rangeEnd;
    	rangeEnd = rangeStart;
    	rangeStart = tmp;
  	}
    return ((Math.random() * (rangeEnd - rangeStart)) + rangeStart);
  },
  // NOTE: The number is always converted to a non-negative integer
  'factorial': function factorial(num) {
    num = Math.abs(parseInt(num))
    if (num <= 1) {
      return 1;
    }
    return (num * this.factorial(num - 1));
  },
  // alteration of function from http://www.ideashower.com/our_solutions/leastgreatest-common-mulitple-lcmgcm-in-php-and-javascript/
  'gcd': function gcd() {
  	var args = Array.prototype.slice.call(arguments);
  	
  	function __gcd(a, b) {
    	return (b == 0) ? a : __gcd(b, a % b);
    }
  	
  	if (args.length > 1) {
  		args.push(__gcd(args.shift(), args.shift()));
  		return gcd.apply(this, args);
  	}
		return args[0];
  },
  // alteration of function from http://www.ideashower.com/our_solutions/leastgreatest-common-mulitple-lcmgcm-in-php-and-javascript/
  'lcm': function lcm() {
  	var args = Array.prototype.slice.call(arguments);
  	
  	function __lcm(a, b) {
    	return (a / gcd(a,b) * b);
    }
  	
  	if (args.length > 1) {
  		args.push(__lcm(args.shift(), args.shift()));
  		return lcm.apply(this, args);
  	}
		return args[0];
  },
  'limit': function limit(f, x, places) {
    if (typeof places != "number" && !(places instanceof Number)) {
    	places = 10;
  	}
    
    var atX = f(x);
    // we assume that if it's not a NaN that Javascript has correctly calculated the function
    if (!isNaN(atX)) {
      return atX;
    } else { // else we got a NaN
      // we need to approach x in order to make an approximation of f(x)
      // if x is Infinity
      if (x === Number.POSITIVE_INFINITY) {
        // approach from the left
        return this.limitLeft(f, x, places);
      // else if x is -Infinity
      } else if (x === Number.NEGATIVE_INFINITY) {
        // approach from the right
        return this.limitRight(f, x, places);
      // else if we don't have a number
      } else if (isNaN(x)) {
        // not sure why this would happen... the user being stupid I guess
        return Number.NaN;
      // else we have a number (-Infinity, Infinity)
      } else {
        // approach from both left and right
        var left = this.limitLeft(f, x, places);
        var right = this.limitRight(f, x, places);
        // if left and right values match, return
        if (left == right) {
          return left;
        }
        // else, there's no convergence. This is a sign to the user they may want to try the limit from only one side
        return Number.NaN;
      }
    }
  },
  // approach x from values greater than x
  'limitRight': function limitRight(f, x, places) {
    if (typeof places != "number" && !(places instanceof Number)) {
    	places = 10;
  	}
  	
  	// populate test numbers
  	var testNums = [];
  	var testResults = [];
  	// use x as the input seed for the numbers used in our approximation
  	var testNumber = x;
  	var verySmallNumber = 1e-10
  	if (places > 10) {
    	verySmallNumber = eval("1e-" + places);
  	}
  	
  	// check five times against our numbers very slightly different from x
  	for (var k = 0; k < 5; k++) {
    	testNumber += verySmallNumber;
    	testNums.push(testNumber);
    	testResults.push(f(testNumber));
  	}
  	
  	var allRounded = testResults.map(function(a) {
    	return MP.round(a, places);
  	});
  	// if we don't have a native reduce method, add it to just the allRounded array
  	if (!allRounded.reduce) {
      allRounded.reduce = this.__reduce;
    }
    var allEqual = allRounded.reduce(function(a, b) {
      return a == b;
    });
    // if all the rounded values are equal
    if (allEqual == true) {
      // return the rounded value
      return allRounded[0];
    }
    return Number.NaN;
  },
  // approach x from values less than x
  'limitLeft': function limitLeft(f, x, places) {
    if (typeof places != "number" && !(places instanceof Number)) {
    	places = 10;
  	}
  	
  	// populate test numbers
  	var testNums = [];
  	var testResults = [];
  	// use x as the input seed for the numbers used in our approximation
  	var testNumber = x;
  	var verySmallNumber = 1e-10
  	if (places > 10) {
    	verySmallNumber = eval("1e-" + places);
  	}
  	
  	// check five times against our numbers very slightly different from x
  	for (var k = 0; k < 5; k++) {
    	testNumber -= verySmallNumber;
    	testNums.push(testNumber);
    	testResults.push(f(testNumber));
  	}
  	
  	var allRounded = testResults.map(function(a) {
    	return MP.round(a, places);
  	});
  	// if we don't have a native reduce method, add it to just the allRounded array
  	if (!allRounded.reduce) {
      allRounded.reduce = this.__reduce;
    }
    var allEqual = allRounded.reduce(function(a, b) {
      return a == b;
    });
    // if all the rounded values are equal
    if (allEqual == true) {
      // return the rounded value
      return allRounded[0];
    }
    return Number.NaN;
  },
  '__reduce': function __reduce(fun /*, initial*/) {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (i in this)
        {
          var rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      }
      while (true);
    }

    for (; i < len; i++)
    {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  }
};

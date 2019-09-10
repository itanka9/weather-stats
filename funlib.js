const avg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

const flatten = arr => arr.reduce((result, x) => result.concat(Object.values(x)), []);

const minMax = data => {
    return data.reduce(
        (acc, x) => ({ min: Math.min(acc.min, x), max: Math.max(acc.max, x) }),
        { min: Infinity, max: -Infinity }
    );
}

// @https://davidwalsh.name/javascript-debounce-function
function debounce (func, wait, immediate) {
	let timeout;
	return function () {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
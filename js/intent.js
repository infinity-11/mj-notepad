const Intent = {}
Intent.putExtra = function (key, data, url) {
	let dataStr = JSON.stringify(data);
	let extraStr = dataStr;
	extraStr = btoa(extraStr);
	sessionStorage.setItem("extra" + key, extraStr);
	location.replace(url);
}
Intent.getExtra = function (key) {
	let scrambled = sessionStorage.getItem("extra" + key);
	let extraStr = scrambled;
	extraStr = atob(extraStr);
	let extra = {};
	try { extra = JSON.parse(extraStr) }
	catch { extra = {} }
	return extra;
}
Object.freeze(Intent);
var $ = function(id) {
	return document.getElementById(id);
}
var uKey=function(arg){
	if(arg!==undefined){
		localStorage['nib_user_key']=arg;
	}

	return localStorage['nib_user_key'];
}
var getXMLVal = function(el, tag) {
	try {
		return el.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
	} catch(e) {
		return '';
	}

}
function server(opt) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		try {
			if(xhr.readyState == 4 && xhr.status == 200) {
				opt.callback(opt.dataType == 'xml' ? xhr.responseXML : JSON.parse(xhr.responseText));
			}

		} catch(e) {
			console.log(e);
		}
	};
	xhr.open(opt.type || 'GET', opt.url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(opt.params || null);
}
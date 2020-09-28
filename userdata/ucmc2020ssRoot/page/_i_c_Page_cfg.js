var page_cfgRotationCenterX = 0.0;
var page_cfgRotationCenterY = 0.0;
var page_cfgRotationCenterZ = 0.0;
var cfgOperations = [];
var cfgFlows = [];

var about_vertexAmount = 1;
var about_criticalRoute = 1;
var about_clpfWidth = 1;

function handleLoadedpage_about(page_aboutData) {
	about_vertexAmount = page_aboutData.vertexAmount;
	about_criticalRoute = page_aboutData.criticalRoute;
	about_clpfWidth = page_aboutData.clpfWidth;
}

function handleLoadedpage_cfg(page_cfgData) {
	page_cfgRotationCenterX = page_cfgData.rotationCenterX;
	page_cfgRotationCenterY = page_cfgData.rotationCenterY;
	page_cfgRotationCenterZ = page_cfgData.rotationCenterZ;
	
	cfgOperations = page_cfgData.totalOpLevels;
	cfgFlows = page_cfgData.totalFlLevels;
}

function loadpage_cfg() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Page_cfg.json", false);
	request.setRequestHeader('cache-control', 'no-cache');
	
	try {
		request.send();
		if (request.status == 200) {
		  handleLoadedpage_cfg(JSON.parse(request.responseText))
		}
		else {
			alert("Error loading .cfg file");
		}
	} catch(err) {
		alert("Could not load .cfg file");
	}
}

function loadpage_about() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Page_about.json", false);
	request.setRequestHeader('cache-control', 'no-cache');
	
	try {
		request.send();
		if (request.status == 200) {
			handleLoadedpage_about(JSON.parse(request.responseText))
		}
		else {
			alert("Error loading .about file");
		}
	} catch(err) {
		alert("Could not load .about file");
	}
}

function page_verify_cfg() {
}

function page_verify_about() {
}

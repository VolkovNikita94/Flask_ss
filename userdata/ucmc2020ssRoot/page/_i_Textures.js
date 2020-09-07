// Textures :)
var axis_coreTexture;
var axis_xTexture;
var axis_yTexture;
var axis_zTexture;
var flowsTexture;
var operationsTexture;

var curfl_texture;
var curop_texture;
var pastfl_texture;
var pastop_texture;

function handleLoadedTexture(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTextures() {
	axis_coreTexture = gl.createTexture();
	axis_coreTexture.image = new Image();
	axis_coreTexture.image.onload = function () {
		handleLoadedTexture(axis_coreTexture)
	}

	axis_coreTexture.image.src = "Textures/_t_axis_coreTexture.png";
	axis_xTexture = gl.createTexture();
	axis_xTexture.image = new Image();
	axis_xTexture.image.onload = function () {
		handleLoadedTexture(axis_xTexture)
	}

	axis_xTexture.image.src = "Textures/_t_axis_xTexture.png";
	
	axis_yTexture = gl.createTexture();
	axis_yTexture.image = new Image();
	axis_yTexture.image.onload = function () {
		handleLoadedTexture(axis_yTexture)
	}

	axis_yTexture.image.src = "Textures/_t_axis_yTexture.png";
	
	axis_zTexture = gl.createTexture();
	axis_zTexture.image = new Image();
	axis_zTexture.image.onload = function () {
		handleLoadedTexture(axis_zTexture)
	}

	axis_zTexture.image.src = "Textures/_t_axis_zTexture.png";
	
	flowsTexture = gl.createTexture();
	flowsTexture.image = new Image();
	flowsTexture.image.onload = function () {
		handleLoadedTexture(flowsTexture)
	}
	flowsTexture.image.src = "Textures/_t_flowsTexture.png";
	
	operationsTexture = gl.createTexture();
	operationsTexture.image = new Image();
	operationsTexture.image.onload = function () {
		handleLoadedTexture(operationsTexture)
	}
	operationsTexture.image.src = "Textures/_t_operationsTexture.png";
	
	pastfl_texture = gl.createTexture();
	pastfl_texture.image = new Image();
	pastfl_texture.image.onload = function () {
		handleLoadedTexture(pastfl_texture)
	}
	pastfl_texture.image.src = "Textures/_t_pastfl_texture.png";
	
	pastop_texture = gl.createTexture();
	pastop_texture.image = new Image();
	pastop_texture.image.onload = function () {
		handleLoadedTexture(pastop_texture)
	}
	pastop_texture.image.src = "Textures/_t_pastop_texture.png";
	
	curfl_texture = gl.createTexture();
	curfl_texture.image = new Image();
	curfl_texture.image.onload = function () {
		handleLoadedTexture(curfl_texture)
	}
	curfl_texture.image.src = "Textures/_t_current_fl_texture.png";
	
	curop_texture = gl.createTexture();
	curop_texture.image = new Image();
	curop_texture.image.onload = function () {
		handleLoadedTexture(curop_texture)
	}
	curop_texture.image.src = "Textures/_t_current_op_texture.png";
}
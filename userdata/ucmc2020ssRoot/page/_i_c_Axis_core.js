var axis_coreVertexPositionBuffer;
var axis_coreVertexNormalBuffer;
var axis_coreVertexTextureCoordBuffer;
var axis_coreVertexIndexBuffer;
var axis_coreLoaded = false;

function handleLoadedaxis_core(axis_coreData) {
	axis_coreVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_coreData.vertexNormals), gl.STATIC_DRAW);
	axis_coreVertexNormalBuffer.itemSize = 3;
	axis_coreVertexNormalBuffer.numItems = axis_coreData.vertexNormals.length / 3;

	axis_coreVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_coreData.vertexTextureCoords), gl.STATIC_DRAW);
	axis_coreVertexTextureCoordBuffer.itemSize = 2;
	axis_coreVertexTextureCoordBuffer.numItems = axis_coreData.vertexTextureCoords.length / 2;

	axis_coreVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_coreData.vertexPositions), gl.STATIC_DRAW);
	axis_coreVertexPositionBuffer.itemSize = 3;
	axis_coreVertexPositionBuffer.numItems = axis_coreData.vertexPositions.length / 3;

	axis_coreVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_coreVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(axis_coreData.indices), gl.STATIC_DRAW);
	axis_coreVertexIndexBuffer.itemSize = 1;
	axis_coreVertexIndexBuffer.numItems = axis_coreData.indices.length;

	axis_coreLoaded = true;
}

function loadaxis_core() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Axis_core.json");
	
	request.onload = function () {
		if (request.status == 200) {
			handleLoadedaxis_core(JSON.parse(request.responseText));
		}
		else {
			alert("Error loading core model");
		}
	}
	
	request.onerror = function() {
		alert("Could not load core model");
	}
	
	request.send();
}

function drawaxis_core(mvMatrix, shaderProgram) {
	if (axis_coreLoaded == false) {
		return;
	}

	mvPushMatrix(mvMatrix);
	
	gl.useProgram(shaderProgram);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
	gl.uniform1i(shaderProgram.useLightingUniform, false);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : true);
	
	mat4.translate(mvMatrix, [0, 0, 0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, axis_coreTexture);
	gl.uniform4f(shaderProgram.fragmentColorUniform, 0, 0, 0, 1);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axis_coreVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, axis_coreVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_coreVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, axis_coreVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_coreVertexIndexBuffer);
	setMatrixUniforms(shaderProgram);
	gl.drawElements(gl.TRIANGLES, axis_coreVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	
	mvPopMatrix(mvMatrix);	
}
var axis_xVertexPositionBuffer;
var axis_xVertexNormalBuffer;
var axis_xVertexTextureCoordBuffer;
var axis_xVertexIndexBuffer;
var axis_xLoaded = false;

function handleLoadedaxis_x(axis_xData) {
	axis_xVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_xData.vertexNormals), gl.STATIC_DRAW);
	axis_xVertexNormalBuffer.itemSize = 3;
	axis_xVertexNormalBuffer.numItems = axis_xData.vertexNormals.length / 3;

	axis_xVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_xData.vertexTextureCoords), gl.STATIC_DRAW);
	axis_xVertexTextureCoordBuffer.itemSize = 2;
	axis_xVertexTextureCoordBuffer.numItems = axis_xData.vertexTextureCoords.length / 2;

	axis_xVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_xData.vertexPositions), gl.STATIC_DRAW);
	axis_xVertexPositionBuffer.itemSize = 3;
	axis_xVertexPositionBuffer.numItems = axis_xData.vertexPositions.length / 3;

	axis_xVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_xVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(axis_xData.indices), gl.STATIC_DRAW);
	axis_xVertexIndexBuffer.itemSize = 1;
	axis_xVertexIndexBuffer.numItems = axis_xData.indices.length;

	axis_xLoaded = true;
}

function loadaxis_x() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Axis_x.json");
	
	request.onload = function () {
		if (request.status == 200) {
			handleLoadedaxis_x(JSON.parse(request.responseText));
		}
		else {
			alert("Error loading X axis");
		}
	}
	
		request.onerror = function() {
		alert("Could not load X axis");
	}
	
	request.send();
}

function drawaxis_x(mvMatrix, shaderProgram) {
	if (axis_xLoaded == false) {
		return;
	}

	mvPushMatrix(mvMatrix);
	
	gl.useProgram(shaderProgram);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
	gl.uniform1i(shaderProgram.useLightingUniform, false);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : true);
	
	mat4.translate(mvMatrix, [0, 0, 0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, axis_xTexture);
	gl.uniform4f(shaderProgram.fragmentColorUniform, 0, 0, 0, 1);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axis_xVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, axis_xVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_xVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, axis_xVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_xVertexIndexBuffer);
	setMatrixUniforms(shaderProgram);
	gl.drawElements(gl.TRIANGLES, axis_xVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	
	mvPopMatrix(mvMatrix);	
}
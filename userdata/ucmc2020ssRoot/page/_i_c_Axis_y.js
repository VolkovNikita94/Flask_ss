var axis_yVertexPositionBuffer;
var axis_yVertexNormalBuffer;
var axis_yVertexTextureCoordBuffer;
var axis_yVertexIndexBuffer;
var axis_yLoaded = false;

function handleLoadedaxis_y(axis_yData) {
	axis_yVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_yData.vertexNormals), gl.STATIC_DRAW);
	axis_yVertexNormalBuffer.itemSize = 3;
	axis_yVertexNormalBuffer.numItems = axis_yData.vertexNormals.length / 3;

	axis_yVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_yData.vertexTextureCoords), gl.STATIC_DRAW);
	axis_yVertexTextureCoordBuffer.itemSize = 2;
	axis_yVertexTextureCoordBuffer.numItems = axis_yData.vertexTextureCoords.length / 2;

	axis_yVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_yData.vertexPositions), gl.STATIC_DRAW);
	axis_yVertexPositionBuffer.itemSize = 3;
	axis_yVertexPositionBuffer.numItems = axis_yData.vertexPositions.length / 3;

	axis_yVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_yVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(axis_yData.indices), gl.STATIC_DRAW);
	axis_yVertexIndexBuffer.itemSize = 1;
	axis_yVertexIndexBuffer.numItems = axis_yData.indices.length;

	axis_yLoaded = true;
}

function loadaxis_y() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Axis_y.json");
	
	request.onload = function () {
		if (request.status == 200) {
			handleLoadedaxis_y(JSON.parse(request.responseText));
		}
		else {
			alert("Error loading Y axis");
		}
	}
	
	request.onerror = function() {
		alert("Could not load Y axis");
	}
	
	request.send();
}

function drawaxis_y(mvMatrix, shaderProgram) {
	if (axis_yLoaded == false) {
		return;
	}

	mvPushMatrix(mvMatrix);
	
	gl.useProgram(shaderProgram);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
	gl.uniform1i(shaderProgram.useLightingUniform, false);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : true);
	
	mat4.translate(mvMatrix, [0, 0, 0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, axis_yTexture);
	gl.uniform4f(shaderProgram.fragmentColorUniform, 0, 0, 0, 1);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axis_yVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, axis_yVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_yVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, axis_yVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_yVertexIndexBuffer);
	setMatrixUniforms(shaderProgram);
	gl.drawElements(gl.TRIANGLES, axis_yVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	
	mvPopMatrix(mvMatrix);	
}
var axis_zVertexPositionBuffer;
var axis_zVertexNormalBuffer;
var axis_zVertexTextureCoordBuffer;
var axis_zVertexIndexBuffer;
var axis_zLoaded = false;

function handleLoadedaxis_z(axis_zData) {
	axis_zVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_zData.vertexNormals), gl.STATIC_DRAW);
	axis_zVertexNormalBuffer.itemSize = 3;
	axis_zVertexNormalBuffer.numItems = axis_zData.vertexNormals.length / 3;

	axis_zVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_zData.vertexTextureCoords), gl.STATIC_DRAW);
	axis_zVertexTextureCoordBuffer.itemSize = 2;
	axis_zVertexTextureCoordBuffer.numItems = axis_zData.vertexTextureCoords.length / 2;

	axis_zVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axis_zData.vertexPositions), gl.STATIC_DRAW);
	axis_zVertexPositionBuffer.itemSize = 3;
	axis_zVertexPositionBuffer.numItems = axis_zData.vertexPositions.length / 3;

	axis_zVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_zVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(axis_zData.indices), gl.STATIC_DRAW);
	axis_zVertexIndexBuffer.itemSize = 1;
	axis_zVertexIndexBuffer.numItems = axis_zData.indices.length;

	axis_zLoaded = true;
}

function loadaxis_z() {
	var request = new XMLHttpRequest();
	request.open("GET", "Json_models/Axis_z.json");
	
	request.onload = function () {
		if (request.status == 200) {
			handleLoadedaxis_z(JSON.parse(request.responseText));
		}
		else {
			alert("Error loading Z axis");
		}
	}
	
	request.onerror = function() {
		alert("Could not load Z axis");
	}
	
	request.send();
}

function drawaxis_z(mvMatrix, shaderProgram) {
	if (axis_zLoaded == false) {
		return;
	}

	mvPushMatrix(mvMatrix);
	
	gl.useProgram(shaderProgram);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
	gl.uniform1i(shaderProgram.useLightingUniform, false);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : true);
	
	mat4.translate(mvMatrix, [0, 0, 0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, axis_zTexture);
	gl.uniform4f(shaderProgram.fragmentColorUniform, 0, 0, 0, 1);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axis_zVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, axis_zVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axis_zVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, axis_zVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axis_zVertexIndexBuffer);
	setMatrixUniforms(shaderProgram);
	gl.drawElements(gl.TRIANGLES, axis_zVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	
	mvPopMatrix(mvMatrix);	
}
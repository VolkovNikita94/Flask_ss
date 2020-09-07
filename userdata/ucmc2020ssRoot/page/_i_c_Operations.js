var operationsVertexPositionBuffer; //new Array(num_levels);
var operationsVertexNormalBuffer; //new Array(num_levels);
var operationsVertexTextureCoordBuffer; //new Array(num_levels);
var operationsVertexIndexBuffer; //new Array(num_levels);

var typeOffsetArray;
var typeSizeArray;

function handleLoadedoperations(operationsData, level, curType) {
	operationsVertexNormalBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexNormalBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(operationsData.vertexNormals), gl.STATIC_DRAW);
	operationsVertexNormalBuffer[level][curType].itemSize = 3;
	operationsVertexNormalBuffer[level][curType].numItems = operationsData.vertexNormals.length / 3;

	operationsVertexTextureCoordBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexTextureCoordBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(operationsData.vertexTextureCoords), gl.STATIC_DRAW);
	operationsVertexTextureCoordBuffer[level][curType].itemSize = 2;
	operationsVertexTextureCoordBuffer[level][curType].numItems = operationsData.vertexTextureCoords.length / 2;

	operationsVertexPositionBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexPositionBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(operationsData.vertexPositions), gl.STATIC_DRAW);
	operationsVertexPositionBuffer[level][curType].itemSize = 3;
	operationsVertexPositionBuffer[level][curType].numItems = operationsData.vertexPositions.length / 3;

	operationsVertexIndexBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, operationsVertexIndexBuffer[level][curType]);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(operationsData.indices), gl.STATIC_DRAW);
	operationsVertexIndexBuffer[level][curType].itemSize = 1;
	operationsVertexIndexBuffer[level][curType].numItems = operationsData.indices.length;
}

// Async body load
function loadoperations(level, type) {
	var request = new XMLHttpRequest();
	var str = String("Json_models/Op_" + level + "_" + type + ".json");
	request.open("GET", str, true);
	request.setRequestHeader('cache-control', 'no-cache');
	
	request.onload = function () {
		try {
			if (request.status == 200) {
				// Shift back
				handleLoadedoperations(JSON.parse(request.responseText), level - 1, type);
			}
			else {
				alert("Error loading one of operation files");
			}
		}
		catch (exception) {
			operationsVertexPositionBuffer[level][type] = 0; 
			operationsVertexNormalBuffer[level][type] = 0;
			operationsVertexTextureCoordBuffer[level][type] = 0; 
			operationsVertexIndexBuffer[level][type] = 0;
			alert("Exception loading one of operation files");
		}	
	}
	
	request.onerror = function() {
		alert("Could not load one of operation files");
	}
	
	request.send();	
}

function drawoperations(mvMatrix, shaderProgram, level, cur_level) {
	mvPushMatrix(mvMatrix);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, text.displayMode == "B&W" ? false : text.lighting);
	gl.uniform1i(shaderProgram.useLightingUniform, text.displayMode == "B&W" ? false : text.lighting);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : text.texturing);
	
	gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3);
	gl.uniform3f(shaderProgram.pointLightingLocationUniform, 20, 20, 20);
	gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
	gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
	
	for (var curType = 0; curType < numTypes; curType++) {
		var test = operationsVertexPositionBuffer[level][curType];
		if (test === 0) 
		{
		}
		else if (curType !== 0 || (curType === 0 && text.displayInput === true))
		{
			var fixColor = text.displayMode == "B&W" ? bwpalette[curType] : palette[curType];
			gl.activeTexture(gl.TEXTURE0);
			if (level < cur_level) {
				gl.bindTexture(gl.TEXTURE_2D, pastop_texture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 0.37, fixColor[1] * 0.37, fixColor[2] * 0.37, fixColor[3]);
			} else if (level == cur_level) {
				gl.bindTexture(gl.TEXTURE_2D, curop_texture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 2, fixColor[1] * 2, fixColor[2] * 2, fixColor[3]);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, operationsTexture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 0.75, fixColor[1] * 0.75, fixColor[2] * 0.75, fixColor[3]);
			}
			gl.uniform1i(shaderProgram.samplerUniform, 0);
			gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);
	
			gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexPositionBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, operationsVertexPositionBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexTextureCoordBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, operationsVertexTextureCoordBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, operationsVertexNormalBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, operationsVertexNormalBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, operationsVertexIndexBuffer[level][curType]);
			setMatrixUniforms(shaderProgram);
			gl.drawElements(gl.TRIANGLES, operationsVertexIndexBuffer[level][curType].numItems, gl.UNSIGNED_SHORT, 0);							
		}
	}
	
	mvPopMatrix(mvMatrix);	
}
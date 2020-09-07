var flowsVertexPositionBuffer; //new Array(num_levels);
var flowsVertexNormalBuffer; //new Array(num_levels);
var flowsVertexTextureCoordBuffer; // new Array(num_levels);
var flowsVertexIndexBuffer; //new Array(num_levels);

function handleLoadedflows(flowsData, level, curType) {
	flowsVertexPositionBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexPositionBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flowsData.vertexPositions), gl.STATIC_DRAW);
	flowsVertexPositionBuffer[level][curType].itemSize = 3;
	flowsVertexPositionBuffer[level][curType].numItems = flowsData.vertexPositions.length / 3;

	flowsVertexNormalBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexNormalBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flowsData.vertexNormals), gl.STATIC_DRAW);
	flowsVertexNormalBuffer[level][curType].itemSize = 3;
	flowsVertexNormalBuffer[level][curType].numItems = flowsData.vertexNormals.length / 3;

	flowsVertexTextureCoordBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexTextureCoordBuffer[level][curType]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flowsData.vertexTextureCoords), gl.STATIC_DRAW);
	flowsVertexTextureCoordBuffer[level][curType].itemSize = 2;
	flowsVertexTextureCoordBuffer[level][curType].numItems = flowsData.vertexTextureCoords.length / 2;

	flowsVertexIndexBuffer[level][curType] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, flowsVertexIndexBuffer[level][curType]);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flowsData.indices), gl.STATIC_DRAW);
	flowsVertexIndexBuffer[level][curType].itemSize = 1;
	flowsVertexIndexBuffer[level][curType].numItems = flowsData.indices.length;
}

// Async body load
function loadflows(level, type) {
	var request = new XMLHttpRequest();
	var str = String("Json_models/Fl_" + level + "_" + type + ".json");
	request.open("GET", str, true);
	request.setRequestHeader('cache-control', 'no-cache');
	
	request.onload = function () {
		try {
			if (request.status == 200) {
				// Shift back
				handleLoadedflows(JSON.parse(request.responseText), level - 1, type);
			}
			else {
				alert("Error loading one of flow files");
			}
		} 
		catch (exception) {
			flowsVertexPositionBuffer[level][type] = 0; 
			flowsVertexNormalBuffer[level][type] = 0;
			flowsVertexTextureCoordBuffer[level][type] = 0; 
			flowsVertexIndexBuffer[level][type] = 0;
			alert("Exception loading one of flow files");
		}	
	}
	
	request.onerror = function() {
		alert("Could not load one of flow files");
	}
	
	request.send();	
}

function drawflows(mvMatrix, shaderProgram, level, cur_level) {
	mvPushMatrix(mvMatrix);
	
	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, text.displayMode == "B&W" ? false : text.lighting);
	gl.uniform1i(shaderProgram.useLightingUniform, text.displayMode == "B&W" ? false : text.lighting);
	gl.uniform1i(shaderProgram.useTexturesUniform, text.displayMode == "B&W" ? false : text.texturing);
	
	gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3);
	gl.uniform3f(shaderProgram.pointLightingLocationUniform, 20, 20, 20);
	gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
	gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
	
	for (var curType = 0; curType < numFlowTypes; curType++) {
		var test = flowsVertexPositionBuffer[level][curType];
		if (test === 0) 
		{
		}
		else if (curType !== 0 || (curType === 0 && text.displayInput === true))
		{	
			var fixColor = text.displayMode == "B&W" ? bwpalette[9] : palette[9];
			gl.activeTexture(gl.TEXTURE0);
			if (level < cur_level) {
				gl.bindTexture(gl.TEXTURE_2D, pastfl_texture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 0.37, fixColor[1] * 0.37, fixColor[2] * 0.37, fixColor[3]);
			} else if (level == cur_level) {
				gl.bindTexture(gl.TEXTURE_2D, curfl_texture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 2, fixColor[1] * 2, fixColor[2] * 2, fixColor[3]);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, flowsTexture);
				// Pass fixed color to shader program
				gl.uniform4f(shaderProgram.fragmentColorUniform, fixColor[0] * 0.75, fixColor[1] * 0.75, fixColor[2] * 0.75, fixColor[3]);
			}
			gl.uniform1i(shaderProgram.samplerUniform, 0);
			gl.uniform1f(shaderProgram.materialShininessUniform, 32.0);

			gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexPositionBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, flowsVertexPositionBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexTextureCoordBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, flowsVertexTextureCoordBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, flowsVertexNormalBuffer[level][curType]);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, flowsVertexNormalBuffer[level][curType].itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, flowsVertexIndexBuffer[level][curType]);
			setMatrixUniforms(shaderProgram);
			gl.drawElements(gl.TRIANGLES, flowsVertexIndexBuffer[level][curType].numItems, gl.UNSIGNED_SHORT, 0);		
		}
	}
	
	mvPopMatrix(mvMatrix);	
}
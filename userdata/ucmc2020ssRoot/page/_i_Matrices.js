// Model view and projection matrices
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
	  throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms(shaderProgram) {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	
	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function project(point, viewMat, projMat, scrWidth, scrHeight, point2d) {
	mat4.multiply(projMat, viewMat, viewMat);
	//transform world to clipping coordinates
	point = mat4.multiplyVec4(viewMat, point);
	point2d[0] = Math.round((( point[0] / point[3] + 1.0 ) / 2.0) * scrWidth );
	point2d[1] = Math.round((( 1.0 - point[1] / point[3] ) / 2.0) * scrHeight );
}

function fitToScreen(point, viewMat, projMat, scrWidth, scrHeight) {
	if (point[0] >= 0 && point[0] <= scrWidth && point[1] >= 0 && point[1] <= scrHeight) {
		return;
	}
	
	return;
}

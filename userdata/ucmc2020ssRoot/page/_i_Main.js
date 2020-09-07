// GL and canvas global objects
var gl;
var gl_overlay;
var canvas;
var canvas_overlay;

// Initialize GL.
function initGL() {
	try {
		gl = canvas.getContext("webgl");
		gl_overlay = canvas_overlay.getContext("2d");
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	if (!gl_overlay) {
		alert("Could not initialise overlay, sorry :-(");
	}
}

// Resize GL field to fit the window
function resizeGL() {
	// Lookup the size the browser is displaying the canvas.
	var displayWidth  = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;
 
  // Make the canvas the same size
  canvas.width  = displayWidth;
  canvas.height = displayHeight;
	
	// Adjust overlay to main canvas size
	canvas_overlay.width = displayWidth;
	canvas_overlay.height = displayHeight;

  // Set the viewport to match
	gl.viewportWidth = displayWidth;
	gl.viewportHeight = displayHeight;
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
}

function loadWorld() {
	loadpage_cfg();
	loadpage_about();
	
	
	loadaxis_core();
	loadaxis_x();
	loadaxis_y();
	loadaxis_z();

	// Initialize operation buffer arrays
	// Amount of LPF levels is known from config file
	flowsVertexPositionBuffer = new Array(cfgFlows.length);
	flowsVertexNormalBuffer = new Array(cfgFlows.length);
	flowsVertexTextureCoordBuffer = new Array(cfgFlows.length);
	flowsVertexIndexBuffer = new Array(cfgFlows.length);	

	for (var level = 0; level < cfgFlows.length; level++) {
		flowsVertexPositionBuffer[level] = new Array(numFlowTypes);
		flowsVertexNormalBuffer[level] = new Array(numFlowTypes);
		flowsVertexTextureCoordBuffer[level] = new Array(numFlowTypes);
		flowsVertexIndexBuffer[level] = new Array(numFlowTypes);
		for (var type = 0; type < numFlowTypes; type++) {
			flowsVertexPositionBuffer[level][type] = 0; 
			flowsVertexNormalBuffer[level][type] = 0;
			flowsVertexTextureCoordBuffer[level][type] = 0; 
			flowsVertexIndexBuffer[level][type] = 0;
		}
	}
	
	for (var level = 0; level < cfgFlows.length; level++) {
		for (var type = 0; type < cfgFlows[level].length; type++) {
			// Levels in json files are shifted for now...
			loadflows(level + 1, cfgFlows[level][type]);
		}
	}
	
	// Initialize operation buffer arrays
	// Amount of LPF levels is known from config file
	operationsVertexPositionBuffer = new Array(cfgOperations.length);
	operationsVertexNormalBuffer = new Array(cfgOperations.length);
	operationsVertexTextureCoordBuffer = new Array(cfgOperations.length);
	operationsVertexIndexBuffer = new Array(cfgOperations.length);

	for (var level = 0; level < cfgOperations.length; level++) {
		operationsVertexPositionBuffer[level] = new Array(numTypes);
		operationsVertexNormalBuffer[level] = new Array(numTypes);
		operationsVertexTextureCoordBuffer[level] = new Array(numTypes);
		operationsVertexIndexBuffer[level] = new Array(numTypes);
		for (var type = 0; type < numTypes; type++) {
			operationsVertexPositionBuffer[level][type] = 0; 
			operationsVertexNormalBuffer[level][type] = 0;
			operationsVertexTextureCoordBuffer[level][type] = 0; 
			operationsVertexIndexBuffer[level][type] = 0;
		}
	}
	
	for (var level = 0; level < cfgOperations.length; level++) {
		for (var type = 0; type < cfgOperations[level].length; type++) {
			// Levels in json files are shifted for now...
			loadoperations(level + 1, cfgOperations[level][type]);
		}
	}
}

function drawScene() {
	// Setup canvas
	resizeGL();
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Change background if requested
	if (text.displayMode == "Normal") {
		gl.clearColor(0, 0, 0, 1);
	}
	if (text.displayMode == "Light") {
		gl.clearColor(0, 0, 0, 0);
	}
	if (text.displayMode == "B&W") {
		gl.clearColor(1, 1, 1, 1);
	}	
	
	// Setup perspective
	var relation = gl.viewportWidth / gl.viewportHeight;
	if (text.perspective == true) {
		mat4.perspective(15 * zoom_level, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix); 	
	}
	else {
		mat4.ortho(-4 * relation * zoom_level, 4 * relation * zoom_level, -4 * zoom_level, 4 * zoom_level, -100, 100, pMatrix);	
	}
	mat4.identity(mvMatrix);
	
	// Adjust zoom level according to keyboard controls.
	if (text.perspective == true) {
		mat4.translate(mvMatrix, [0, 0, -25]);
	}
	else {
		// Do nothing
	}
	mat4.translate(mvMatrix, movement_vector);

	// Adjust perspective according to mouse controls.
	mat4.multiply(mvMatrix, mouseControlMatrix);
	mat4.rotate(mvMatrix, rotation_angle, rotation_vector);
	
	// Adjust position according to keyboard controls, don't forget default value is different from 0.
	mat4.translate(mvMatrix, [page_cfgRotationCenterX, page_cfgRotationCenterY, page_cfgRotationCenterZ]); // Rotate not around 0,0,0
	
	// -----------------------------
	// Drawing a scene starts here.
	// -----------------------------
	
	// Axis core is always drawn.
	drawaxis_core(mvMatrix, shaderJsonProgram);
	
	// Axis are drawn if appropriate option is engaged.
	if (text.displayAxis == true) {
		drawaxis_x(mvMatrix, shaderJsonProgram);
		drawaxis_y(mvMatrix, shaderJsonProgram);
		drawaxis_z(mvMatrix, shaderJsonProgram);
	}
	
	// Flows are drawn if appropriate option is engaged.
	if (text.displayFlows == true) {
		for (var flow_level = 0; flow_level < cfgFlows.length; flow_level++) {
			drawflows(mvMatrix, shaderJsonProgram, flow_level, cur_level);
		}
	}
	
	// Operations are drawn if appropriate option is engaged.
	if (text.displayOps == true) {
		for (var op_level = 0; op_level < cfgOperations.length; op_level++) {
			drawoperations(mvMatrix, shaderJsonProgram, op_level, cur_level);
		}
	}
	
	// -----------------------------
	// Drawing a scene ends here.
	// -----------------------------
}

function drawOverlay() {
	gl_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);
	
	// Post axis info
	gl_overlay.font = "14pt Times New Roman";
	var point3d = [10.0, 0.0, 0.0, 1.0];
	var point2d = [0, 0];
	
	var anchorOffset = 9 - zoom_level;

	mvPushMatrix(mvMatrix);
	gl_overlay.fillStyle = "rgba(147, 204, 234, 1.0)"; // blue
	project(point3d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height, point2d)
	fitToScreen(point2d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height);
	gl_overlay.fillText("X", point2d[0] + anchorOffset, point2d[1] - anchorOffset);
	mvPopMatrix(mvMatrix);
	
	mvPushMatrix(mvMatrix);
	point3d = [0.0, 10.0, 0.0, 1.0]; point2d = [0, 0];
	gl_overlay.fillStyle = "rgba(229, 177, 30, 1.0)"; // yellow
	project(point3d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height, point2d)
	fitToScreen(point2d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height);
	gl_overlay.fillText("Y", point2d[0] + anchorOffset, point2d[1] - anchorOffset);
	mvPopMatrix(mvMatrix);	
	
	mvPushMatrix(mvMatrix);
	point3d = [0.0, 0.0, 10.0, 1.0]; point2d = [0, 0];
	gl_overlay.fillStyle = "rgba(228, 187, 243, 1.0)"; // pink
	project(point3d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height, point2d)
	fitToScreen(point2d, mvMatrix, pMatrix, canvas_overlay.width, canvas_overlay.height);
	gl_overlay.fillText("Z", point2d[0] + anchorOffset, point2d[1] - anchorOffset);
	mvPopMatrix(mvMatrix);	
	
	// Post all graph info
	var leftMargin = 4;
	var topMargin = 2
	var lineHeight = 14;
	gl_overlay.font = "12pt Times New Roman";
	gl_overlay.fillStyle = "white";
  gl_overlay.fillText("Total vertex count: " + about_vertexAmount, leftMargin, topMargin + lineHeight);
	gl_overlay.fillText("Critical route length: " + about_criticalRoute, leftMargin, topMargin + lineHeight * 2);
	gl_overlay.fillText("Canonical LPF width: " + about_clpfWidth, leftMargin, topMargin + lineHeight * 3);
}

var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;
		if (speed_x != 0) {
			movement_vector[0] += speed_x * elapsed;
        }
		if (speed_y != 0) {
			movement_vector[1] += speed_y * elapsed;
        }
		if (speed_z != 0) {
			movement_vector[2] += speed_z * elapsed;
        }
		if (text.autoRotate == true) {
			rotation_angle += degToRad(0.3);
		}
	}
	lastTime = timeNow;
}

function tick() {
	requestAnimFrame(tick);
	handleKeys();
	drawScene();    
  drawOverlay();
	animate();
}

function webGLStart() {
	// Initiaize webgl utilities.
	canvas = document.getElementById("draw_field");
	canvas_overlay = document.getElementById("overlay_field");
	
	canvas.width = 1200;
	canvas.height = 800;
	canvas_overlay.width = 1200;
	canvas_overlay.height = 800;
	canvas.style.width  = '1200px';
	canvas.style.height = '800px';
	canvas_overlay.style.width  = '1200px';
	canvas_overlay.style.height = '800px';
	
	initGL();
	initShaders();
	initTextures();
	
	// Load all json objects
	loadWorld();

	// Prepare webgl.
	gl.enable(gl.DEPTH_TEST);
	
	// Keyboard controls.
	document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
	
	// Mouse controls.
	canvas_overlay.onmousedown = handleMouseDown;
	canvas_overlay.onmouseup = handleMouseUp;
	canvas_overlay.onmousemove = handleMouseMove;

	// Scene is drawn during every tick.
	tick();
}

window.addEventListener("load", webGLStart); // Fire this once the page is loaded up
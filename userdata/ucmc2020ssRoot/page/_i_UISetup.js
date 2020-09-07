// UI global objects
var text;
var gui;

var InitGUI = function() {  
	// Display parameters.
	this.displayMode = "Normal";
	this.displayAxis = true; 
	this.displayOps = true;
	this.displayFlows = true;
	this.displayInput = true;
	
	// Projection manager;  
	this.oXYproj = function() { 
		mat4.identity(mouseControlMatrix);
	}     
	this.oYZproj = function() { 
		mat4.identity(mouseControlMatrix);
		mat4.rotate(mouseControlMatrix, degToRad(90), [0, 1, 0]);
	}
	this.oXZproj = function() {  
		mat4.identity(mouseControlMatrix);
		mat4.rotate(mouseControlMatrix, degToRad(90), [1, 0, 0]);
	}  
	
	// Additional parameters :)
	this.autoRotate = false;
	this.perspective = true;
	this.lighting = true;
	this.texturing = true;
	this.reset = function() {
		zoom_level = 3;
		mat4.identity(mvMatrix);
		movement_vector = [0.0 , 0.0 , 0.0];
		mat4.identity(mouseControlMatrix);
		rotation_angle = 0;
		this.autoRotate = false;
	}
};

window.onload = function() {
	text = new InitGUI();
	gui = new dat.GUI();

	// Display parameters.
	var displayFolder = gui.addFolder('Display parameters');
	displayFolder.add(text, 'displayMode', [ 'Normal', 'Light', 'B&W' ]).name('Display Mode');
	displayFolder.add(text, 'displayAxis').name('Display axis');
	displayFolder.add(text, 'displayOps').name('Display spheres');
	displayFolder.add(text, 'displayFlows').name('Display data flows');
	displayFolder.add(text, 'displayInput').name('Display i/o');

	// Projection manager
	var projFolder = gui.addFolder('Projection manager');
	projFolder.add(text, 'oXYproj').name('Use XY projection');
	projFolder.add(text, 'oYZproj').name('Use YZ projection');
	projFolder.add(text, 'oXZproj').name('Use XZ projection');
	
	// Additional parameters :)
	var paramFolder = gui.addFolder('Additional parameters');
	paramFolder.add(text, 'autoRotate').name('Automatic rotation');
	paramFolder.add(text, 'perspective').name('Use perspective');
	paramFolder.add(text, 'lighting').name('Use lighting');
	paramFolder.add(text, 'texturing').name('Use textures');
	paramFolder.add(text, 'reset').name('Reset position');
};
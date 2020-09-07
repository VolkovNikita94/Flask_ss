// This is used for keyboard control
var currentlyPressedKeys = [];

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

// Variables used to control mvMatrix adjustments.
var zoom_level = 3;
var speed_x = 0;
var speed_y = 0;
var speed_z = 0;
var movement = 0;

// Variable used to control level-parallel form;
var cur_level = -1;
var last_press = 0;
var cur_moment;

// Moving and model vectors.
var movement_vector = [0.0, 0.0, 0.0];
var rotation_angle = 0;
var rotation_vector = [0.0, 1, 0.0];

// Global objects which limit LPF levels

// Palette used to display different types
// ASSUME THERE'RE ONLY 10 TYPES of OPERATIONS
// ASSUME THERE'RE ONLY 2 TYPES of FLOWS

var numTypes = 10;
var numFlowTypes = 2;

var palette = [
			[1.0, 0.0, 0.0, 1.0],
			[0.0, 1.0, 0.0, 1.0],
			[0.0, 0.0, 1.0, 1.0],
			[0.0, 0.5, 0.5, 1.0],
			[0.5, 0.0, 0.5, 1.0],
			[0.5, 0.5, 0.0, 1.0],
			[0.75, 0.25, 0.25, 1.0],
			[0.25, 0.75, 0.25, 1.0],
			[0.25, 0.25, 0.75, 1.0],
			[0.66, 0.66, 0.66, 1.0]
		]
		
var bwpalette = [
			[0.5, 0.5, 0.5, 1.0],
			[0.3, 0.3, 0.3, 1.0],
			[0.6, 0.6, 0.6, 1.0],
			[0.45, 0.45, 0.45, 1.0],
			[0.4, 0.4, 0.4, 1.0],
			[0.55, 0.55, 0.55, 1.0],
			[0.52, 0.52, 0.52, 1.0],
			[0.58, 0.58, 0.58, 1.0],
			[0.46, 0.46, 0.46, 1.0],
			[0.33, 0.33, 0.33, 1.0]
		]

function handleKeys() {
	if (currentlyPressedKeys[81]) { // Q key used for zooming out.
		if (zoom_level <= 6) { // Never zoom too far away.
			zoom_level += 0.02;
		}
	} else if (currentlyPressedKeys[69]) { // E key used for zooming in.
		if (zoom_level >= 1) { // Never zoom in too much.
			zoom_level -= 0.02;
		}
	} else { // We don't zoom in or out.
	}

	if (currentlyPressedKeys[87]) { // W key used to move forward by Z_axis.
		speed_z = 0.003;
	} else if (currentlyPressedKeys[83]) { // S key used to move backwards by Z_axis.
		speed_z = -0.003;
	} else {
		speed_z = 0;
	}
	
	if (currentlyPressedKeys[65]) { // A key used to move left by X_axis.
		speed_x = 0.003;
	} else if (currentlyPressedKeys[68]) { // D key used to move right by X_axis.
		speed_x = -0.003;
	} else {
		speed_x = 0;
	}
	
	if (currentlyPressedKeys[67]) { // C key used to move up by Y_axis.
		speed_y = -0.003;
	} else if (currentlyPressedKeys[90]) { // Z key used to move down by Y_axis.
		speed_y = 0.003;
	} else {
		speed_y = 0;
	}
	
	// Level-parallel form control.
	if (currentlyPressedKeys[49]) {
		cur_moment = Date.now();
		if (cur_moment - last_press < 300) {
			
		} else {
			last_press = cur_moment;
			if (cur_level > -1) {
				cur_level -= 1;
			}
		}
	} else if (currentlyPressedKeys[50]) {
		cur_moment = Date.now();
		if (cur_moment - last_press < 300) {
			
		} else {
			last_press = cur_moment;
			// Max is used just in case
			if (cur_level < Math.max(cfgOperations.length, cfgFlows.length)) {
				cur_level += 1;
			}
		}
	}
}

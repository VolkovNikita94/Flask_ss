// Mouse state parameters.
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// Matrix used to adjust image by mouse
var mouseControlMatrix = mat4.create();
mat4.identity(mouseControlMatrix);

function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown) {
		return;
	}
	
	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = newX - lastMouseX;
	var newRotationMatrix = mat4.create();
	mat4.identity(newRotationMatrix);
	mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

	var deltaY = newY - lastMouseY;
	mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

	mat4.multiply(newRotationMatrix, mouseControlMatrix, mouseControlMatrix);

	lastMouseX = newX
	lastMouseY = newY;
}

function handleDoubleClick(event) {
	var newX = event.clientX
	var newY = event.clientY
}
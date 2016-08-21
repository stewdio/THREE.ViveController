# THREE.ViveController

A simple HTC Vive controller handler using the Web Gamepad API for use in [THREE.js](https://github.com/mrdoob/three.js/)-based WebVR applications. (Wow, that’s a mouthful!) This is a drop-in replacement for the `ViveController.js` file found in [THREE.js r79](https://github.com/mrdoob/three.js/blob/dev/examples/js/ViveController.js). Note that THREE’s version calls `update()` on itself—using `window.requestAnimationFrame()` which aims for 60fps while `VRDisplay.requestAnimationFrame()` which aims for 90fps may have been more appropriate. Meanwhile this version requires you to call `controller.update()` yourself from your main animation loop. Thanks to Jaume Sanchez Elias (@thespite) and Brandon Jones (@Tojiro) and Ricardo Cabello (@MrDoob) for some great insights on this :)
  
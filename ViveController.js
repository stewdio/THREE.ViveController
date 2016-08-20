THREE.ViveController = function( id ){

	var scope = this

	THREE.Object3D.call( this )
	this.matrixAutoUpdate = false
	this.standingMatrix = new THREE.Matrix4()


	//  Button value storage for comparing live data to prior state.
	//  Making these properties visible rather than private allows you
	//  more flexibilty -- for example, do you just fire when the 
	//  TriggerPressed event fires? Or does your animation loop continue
	//  to react as long as controller.triggerIsPressed === true?

	this.axes              = [ 0, 0 ]
	this.thumbpadIsPressed = false
	this.triggerIsPressed  = false
	this.gripsArePressed   = false
	this.menuIsPressed     = false


	//  Example use case:
	//  window.addEventListener( 'viveControllerTriggerPressed', function( event ){
	//	
	//		console.log( 'vive controller trigger PRESSED!!!!!', event )
	//  })

	function dispatchViveControllerEvent( name, data ){
		
		var event

		if( data === undefined ) event = new CustomEvent( 'viveController'+ name )
		else event = new CustomEvent( 'viveController'+ name, { detail: data })
		window.dispatchEvent( event )
	}


	//  Continuous polling...
	//  Because this function has its own requestAnimationFrame() there’s no
	//  need to call controller.update() in your own animation loop.

	function update(){

		var gamepad, pose

		requestAnimationFrame( update )
		gamepad = navigator.getGamepads()[ id ]
		if( gamepad !== undefined && gamepad.pose !== null ){


			//  Position and orientation.

			pose = gamepad.pose
			scope.position.fromArray( pose.position )
			scope.quaternion.fromArray( pose.orientation )
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale )
			scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix )
			scope.matrixWorldNeedsUpdate = true
			scope.visible = true


			//  Thumbpad and Buttons.

			if( scope.axes[ 0 ] !== gamepad.axes[ 0 ] || 
				scope.axes[ 1 ] !== gamepad.axes[ 1 ]){

				scope.axes[ 0 ] = gamepad.axes[ 0 ]//  X axis: -1 = Left, +1 = Right.
				scope.axes[ 1 ] = gamepad.axes[ 1 ]//  Y axis: -1 = Bottom, +1 = Top.
				dispatchViveControllerEvent( 'AxisChanged', scope.axes )
			}
			if( scope.thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ){

				scope.thumbpadIsPressed = gamepad.buttons[ 0 ].pressed
				if( scope.thumbpadIsPressed ) dispatchViveControllerEvent( 'ThumbpadPressed' )
				else dispatchViveControllerEvent( 'ThumbpadReleased' )
			}
			if( scope.triggerIsPressed !== gamepad.buttons[ 1 ].pressed ){

				scope.triggerIsPressed = gamepad.buttons[ 1 ].pressed
				if( scope.triggerIsPressed ) dispatchViveControllerEvent( 'TriggerPressed' )
				else dispatchViveControllerEvent( 'TriggerReleased' )
			}
			if( scope.gripsArePressed !== gamepad.buttons[ 2 ].pressed ){

				scope.gripsArePressed = gamepad.buttons[ 2 ].pressed
				if( scope.gripsArePressed ) dispatchViveControllerEvent( 'GripsPressed' )
				else dispatchViveControllerEvent( 'GripsReleased' )
			}
			if( scope.menuIsPressed !== gamepad.buttons[ 3 ].pressed ){

				scope.menuIsPressed = gamepad.buttons[ 3 ].pressed
				if( scope.menuIsPressed ) dispatchViveControllerEvent( 'MenuPressed' )
				else dispatchViveControllerEvent( 'MenuReleased' )
			}
		}
		else scope.visible = false
	}


	//  Kick it off, mate!

	update()
}
THREE.ViveController.prototype = Object.create( THREE.Object3D.prototype )
THREE.ViveController.prototype.constructor = THREE.ViveController
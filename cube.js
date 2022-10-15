// Our Javascript will go here.
            const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            //Create a DirectionalLight and turn on shadows for the light
            const light = new THREE.DirectionalLight( 0xffffff, 1 );
            light.position.set( 1, 1, 10 ); //default; light shining from top
            light.castShadow = true; // default false
            scene.add( light );

            //Set up shadow properties for the light
            light.shadow.mapSize.width = 512; // default
            light.shadow.mapSize.height = 512; // default
            light.shadow.camera.near = 0.5; // default
            light.shadow.camera.far = 500; // default

            const geometry = new THREE.BoxGeometry( 2, 1, 1 );
			const material = new THREE.MeshStandardMaterial( { color: 0x0fffff } );
            material.flatShading = true;
			const cube = new THREE.Mesh( geometry, material );
            cube.castShadow = true;
            cube.receiveShadow = false;
			scene.add( cube );

            

			camera.position.z = 5;

            const KeyDownHandlers = Object.freeze({
                'ArrowLeft': animateLeft,
                'ArrowUp': animateUp,
                'ArrowRight': animateRight,
                'ArrowDown': animateDown,
            });
            const keys = new Set();
            document.onkeydown = function(e) {
                keys.add(e.key);
                for (const key of keys) {
                    const handler = KeyDownHandlers[key];
                    if (handler) {
                        handler();
                        e.preventDefault(); // prevent the default action (scroll / move caret)
                    }
                }
            };
            document.onkeyup = function(e) {
                keys.delete(e.key);
            }
            function animateLeft() {
				requestAnimationFrame( animate );
                cube.rotation.y += 0.1;
                // camera.position.x -= 0.1;
				renderer.render( scene, camera );
			}; 
            function animateRight() {
				requestAnimationFrame( animate );
                cube.rotation.y -= 0.1;
                // camera.position.x += 0.1;
				renderer.render( scene, camera );
			}; 
            function animateUp() {
				requestAnimationFrame( animate );
                cube.rotation.x += 0.1;
                // camera.position.y += 0.1;
				renderer.render( scene, camera );
			}; 
            function animateDown() {
				requestAnimationFrame( animate );
                cube.rotation.x -= 0.1;
                // camera.position.y -= 0.1;
				renderer.render( scene, camera );
			}; 
			function animate() {
				requestAnimationFrame( animate );

				renderer.render( scene, camera );
			};

			animate();
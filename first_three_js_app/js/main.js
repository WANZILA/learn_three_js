import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

	const cubes = [
		makeInstance( geometry, 0x44aa88, 0 ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();

// import * as THREE from 'three';

// const fov = 75;
// const aspect = window.innerWidth / window.innerHeight;
// const near = 0.1;
// const far = 5;
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// camera.position.z = 2;

// const scene = new THREE.Scene();

// const boxWidth = 1;
// const boxHeight = 1;
// const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// function makeInstance(geometry, color, x) {
//   const material = new THREE.MeshPhongMaterial({ color });
//   const cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);
//   cube.position.x = x;
//   return cube;
// }

// const cubes = [
//   makeInstance(geometry, 0x44aa88, 0),
//   makeInstance(geometry, 0x8844aa, -2),
//   makeInstance(geometry, 0xaa8844, 2),
// ];

// const color = 0xFFFFFF;
// const intensity = 3;
// const light = new THREE.DirectionalLight(color, intensity);
// light.position.set(-1, 2, 4);
// scene.add(light);

// const canvas = document.querySelector('#c');
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);

// function render(time) {
//   time *= 0.001; // convert to seconds

//   cubes.forEach((cube, ndx) => {
//     const speed = 1 + ndx * 0.1;
//     const rot = time * speed;
//     cube.rotation.x = rot;
//     cube.rotation.y = rot;
//   });

//   renderer.render(scene, camera);
//   requestAnimationFrame(render);
// }
// requestAnimationFrame(render);

// //  ── scene, camera, renderer ────────────────────────────────────
// const scene    = new THREE.Scene();
// const camera   = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });

// renderer.setSize(innerWidth, innerHeight);
// document.body.appendChild(renderer.domElement);
// camera.position.z = 5;

// //  ── a simple cube ───────────────────────────────────────────────
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube     = new THREE.Mesh(geometry, material);

// scene.add(cube);

// //  ── animate loop ────────────────────────────────────────────────
// function animate(time) {
//   // rotate it so you can see it move
//   cube.rotation.x = time * 0.001;
//   cube.rotation.y = time * 0.0015;

//   renderer.render(scene, camera);
// }

// // this will call animate() each frame
// renderer.setAnimationLoop(animate);

// // optional: handle window resizes
// window.addEventListener('resize', () => {
//   camera.aspect = innerWidth/innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(innerWidth, innerHeight);
// });

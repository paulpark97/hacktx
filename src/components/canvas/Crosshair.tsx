import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

// https://stackoverflow.com/a/72724524
const Crosshair = () => {
	const dot = useRef<any>();
	const lines = useRef<any>();
	const { camera } = useThree();

	useFrame(() => {
		const vector = new THREE.Vector3(0, 0, -0.8).unproject(camera);
		dot.current.position.set(...vector.toArray());
		camera.add(lines.current);
		lines.current.position.set(0, 0, -0.8);
	})

	const Line = (props: any) => {
		const ref = useRef<any>()

		useEffect(() => {
			if (ref.current) {
				ref.current.geometry.setFromPoints([props.start, props.end].map((point) => new THREE.Vector3(...point)));
			}
		});

		return (
			<line ref={ref}>
				<bufferGeometry />
				<lineBasicMaterial color="white" />
			</line>
		)
	}

	return (
		<group>
			<group ref={lines}>
				<Line start={[0.05, 0, 0]} end={[0.18, 0, 0]} />
				<Line start={[0, 0.05, 0]} end={[0, 0.18, 0]} />
				<Line start={[-0.05, 0, 0]} end={[-0.18, 0, 0]} />
				<Line start={[0, -0.05, 0]} end={[0, -0.18, 0]} />
			</group>
			<mesh ref={dot}>
				<sphereBufferGeometry args={[0.0005, 64, 32]} />
				<meshBasicMaterial color={'red'} />
			</mesh>
		</group>
	)
}

export default Crosshair;
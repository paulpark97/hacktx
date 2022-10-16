import React, { useRef, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import type { Mesh } from "three";
// import { shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";

// /* @ts-ignore */
// import vertex from "../shaders/glsl/vertex.glsl";
// /* @ts-ignore */
// import frag from "../shaders/glsl/frag.glsl";

// const ColorShiftMaterial = shaderMaterial(
//     {
//         time: 0,
//         color: new THREE.Color(0.05, 0.0, 0.025),
//     },
//     vertex,
//     frag
// );

// // This is the 🔑 that HMR will renew if this file is edited
// // It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
// // @ts-ignore
// ColorShiftMaterial.key = THREE.MathUtils.generateUUID();

// extend({ ColorShiftMaterial });

interface LegoPieceProps {
    color?: string;
    depth: number;
    width: number;
}

const LegoPiece = (props: LegoPieceProps) => {
    const { depth, width } = props;
    const color = props.color ?? '#4287f5';
    // This reference will give us direct access to the mesh
    const mesh = useRef<Mesh>(null!);

    // Set up state for the hovered and active state
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    // useFrame(() => {
    //     if (mesh.current)
    //         mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    // });

    const material = (<meshStandardMaterial color={active ? '#500' : color} flatShading={true} />);
    const cylinderGeometry = (<cylinderBufferGeometry args={[0.3, 0.3, 0.5, 100]} />);
    const cylinders: JSX.Element[] = [];
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < depth; j++) {
            cylinders.push(
                <mesh position={[i * 1 + 0.5 - width / 2, 0.5, j * 1 + 0.5 - depth / 2]}>
                    {cylinderGeometry}
                    {material}
                </mesh>
            )
        }
    }

    return (
        <mesh
            ref={mesh}
            position={[0, 0, 0]}
            onClick={(event) => setActive(!active)}
        >
            <boxBufferGeometry args={[width, 1, depth]} />
            {material}
            {cylinders}
        </mesh>
    );
};

export default LegoPiece;

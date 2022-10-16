import React, { useRef, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import type { Mesh } from "three";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/* @ts-ignore */
import vertex from "../shaders/glsl/vertex.glsl";
/* @ts-ignore */
import frag from "../shaders/glsl/frag.glsl";

const ColorShiftMaterial = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color(0.05, 0.0, 0.025),
    },
    vertex,
    frag
);

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
// @ts-ignore
ColorShiftMaterial.key = THREE.MathUtils.generateUUID();

extend({ ColorShiftMaterial });

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
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    // useFrame(() => {
    //     if (mesh.current)
    //         mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    // });

    let distRow = (width % 2) ? 1 : 0.5;
    let distDepth = (depth % 2) ? 1 : 0.5;
    let numCylinders = depth * width;
    let cylinderAmnt = 0;
    //let cylinderGroups = [];
    let j = 0
    const material = (<meshStandardMaterial color={color} flatShading={true} />);
    const cylinders: JSX.Element[] = [];
    for (let i = 0; i < numCylinders; i++) {
        const cylinder = (
            <mesh
                castShadow={true}
                receiveShadow={false}
                position={
                    numCylinders % 2 == 1 && i == numCylinders - 1
                        ? [0, .45, (distDepth + Math.floor(j / 2)) * ((j % 2) ? -1 : 1)]
                        : [(distRow + Math.floor(i / 2)) * ((i % 2) ? -1 : 1), .45, (distDepth + Math.floor(j / 2)) * ((j % 2) ? -1 : 1)]
                }
            >
                <cylinderBufferGeometry args={[0.3, 0.3, 0.5, 100]} />
                {material}
            </mesh>
        )

        if (i % width == 1) {
            j++;
        }

        cylinders.push(cylinder);
    }

    return (
        <mesh
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
            castShadow={false}
            receiveShadow={true}
        >
            <boxBufferGeometry args={[width, 1, depth]} />
            {material}
            {cylinders}
        </mesh>
    );
};

export default LegoPiece;

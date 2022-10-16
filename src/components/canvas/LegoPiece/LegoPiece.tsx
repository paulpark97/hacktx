import { Vector3 } from '@react-three/fiber';
import React, { useRef, useState } from "react";
import type { Mesh } from "three";

interface LegoPieceProps {
    color?: string;
    depth: number;
    width: number;
    position?: Vector3;
}

const LegoPiece = (props: LegoPieceProps) => {
    const { depth, width } = props;
    const color = props.color ?? '#4287f5';
    const position = props.position ?? [0, 0, 0];
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
                <mesh position={[i * 1 + 0.5 - width / 2, 0.7, j * 1 + 0.5 - depth / 2]}>
                    {cylinderGeometry}
                    {material}
                </mesh>
            )
        }
    }

    return (
        <mesh
            ref={mesh}
            position={position}
            onClick={(event) => setActive(!active)}
        >
            <boxBufferGeometry args={[width, 1, depth]} />
            {material}
            {cylinders}
        </mesh>
    );
};

export default LegoPiece;

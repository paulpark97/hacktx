import { useThree, Vector3, useFrame } from '@react-three/fiber';
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";
import { useDrag } from "react-use-gesture";
import { DragControls, OrbitControls } from 'three-stdlib';
import * as THREE from 'three';

const DefaultMaterialColor = '#4287f5';
const SelectedMaterialColor = '#00';

interface LegoContainerProps {
    children: JSX.Element[];
}

export const LegoContainer = (props: LegoContainerProps) => {
    const [selectedPieces, setSelectedPieces] = useState<Set<string>>(new Set());
    const [selectedConnectors, setSelectedConnectors] = useState<Set<string>>(new Set());

    return <mesh>{
        props.children.map(element => React.cloneElement<LegoPieceProps>(element, {
            ...element.props,
            onSelectedChanged: (selected, pieceId) => {
                if (selected) {
                    setSelectedPieces(new Set([...selectedPieces, pieceId]));
                } else {
                    setSelectedPieces(new Set([...selectedPieces].filter(x => x !== pieceId)));
                }
            },
            selected: selectedPieces.has(element.props.pieceId),
            key: element.props.pieceId,
        })
        )
    }</mesh>;
}

interface LegoPieceProps {
    color?: string;
    depth: number;
    width: number;
    height?: number;
    pieceId: string;
    position?: Vector3;
    selected?: boolean;
    onSelectedChanged?: (newValue: boolean, pieceId: string) => void;
}

export const LegoPiece = (props: LegoPieceProps) => {
    const { depth, width } = props;
    const height = props.height ?? 1
    const [position, setPosition] = useState<Vector3>(props.position ?? [0, 0, 0]);
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const [rotation, setRotation] = useState<number>(0);

    useEffect(() => {
        // const heldKeys = new Set<string>();
        function onKeyDown(e: KeyboardEvent) {
            if (!props.selected || !mesh.current ) { // || heldKeys.has(e.key)
                return
            }
            // heldKeys.add(e.key);
            let [x, y, z] = [0, 0, 0];
            const Handlers: Record<string, Function | undefined> = {
                'ArrowUp': () => z -= 1,
                'ArrowDown': () => z += 1,
                'ArrowLeft': () => x -= 1,
                'ArrowRight': () => x += 1,
                ',': () => y -= 1,
                '.': () => y += 1,
            }

            Handlers[e.key]?.();
            mesh.current.position.add(new THREE.Vector3(x, y, z))
        }
        // function onKeyUp(e: KeyboardEvent) {
        //     heldKeys.delete(e.key)
        // }
        document.addEventListener('keydown', onKeyDown);
        // document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            // document.removeEventListener('keyup', onKeyUp);
        }
    });

    // This reference will give us direct access to the mesh
    const mesh = useRef<Mesh>(null!);

    /** BUGGY MESS **/
    // const bind = useDrag(({ offset: [,], xy: [x, y], first, last }) => {
    //     if (props.selected) {
    //         setPosition([(x - size.width / 2) / aspect, -(y - size.height / 2) / aspect, 0]);
    //     }
    // });

    const onMouseWheel = (event: WheelEvent) => {
        if (props.selected) {
            setRotation(rotation + Math.sign(event.deltaY) * Math.PI / 4);
            event.preventDefault();
            event.stopPropagation();
        }
    };
    useEffect(() => {
        if (props.selected) {
            document.addEventListener('wheel', onMouseWheel, false);
            // document.addEventListener('mousemove', onMouseMove, false);
        }
        return () => {
            document.removeEventListener('wheel', onMouseWheel);
        }
    });


    const material = (<meshStandardMaterial color={props.color} flatShading={false} />);
    const cylinderGeometry = (<cylinderBufferGeometry args={[0.3, 0.3, 0.3, 100]} />);
    const cylinders: JSX.Element[] = [];
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < depth; j++) {
            cylinders.push(<LegoConnector
                key={`${props.pieceId}-${i}-${j}`}
                position={[i * 1 + 0.5 - width / 2, 0.6, j * height + 0.5 - depth / 2]}
                selected={props.selected}
                color={props.color}
            />)
        }
    }

    return (
        <mesh
            ref={mesh}
            position={position}
            rotation={[0, rotation, 0]}
            // BUGGY {...bind() as fucking_any}
            onClick={({ object }) => {
                if (object === mesh.current) {
                    props.onSelectedChanged?.(!props.selected, props.pieceId)
                }
            }}
        >
            <boxBufferGeometry args={[width, height, depth]} />
            {material}
            {cylinders}
        </mesh>
    );
};

interface LegoConnectorProps {
    color?: string;
    position: [number, number, number];
    selected?: boolean;
    onSelectedChanged?: (newValue: boolean) => void;
}

const LegoConnector = (props: LegoConnectorProps) => {
    const material = <meshStandardMaterial
        color={props.selected ? SelectedMaterialColor : (props.color ?? DefaultMaterialColor)}
        flatShading={true}
    />;

    return (
        <mesh
            position={props.position}
            onClick={() => props.onSelectedChanged?.(!props.selected)}
        >
            {<cylinderBufferGeometry args={[0.3, 0.3, 0.3, 100]} />}
            {material}
        </mesh>
    );
}

import { ReactNode, useEffect, useRef } from "react";
import { Preload, OrbitControls, PointerLockControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Canvas, useFrame } from "@react-three/fiber";
import useStore from "../../../hooks/store";
import * as THREE from 'three';
import { usePressedKeys } from "../../canvas/usePressedKeys";

interface CanvasLayoutProps {
    children: ReactNode;
}

const pressedKeys = new Set<string>(); // I hate it here
const Controls = () => {
    const dom = useStore((state) => state.dom);
    const control = useRef(null);
    const pressedKeys = usePressedKeys();

    useEffect(() => {
        if (control) {
            dom.current.style["touch-action"] = "none";
        }
    }, [dom, control]);

    useFrame(({ camera }) => {
        const Handlers: Record<string, (() => void) | undefined> = {
            'w': () => camera.translateZ(-0.4),
            's': () => camera.translateZ(0.4),
            'a': () => camera.translateX(-0.4),
            'd': () => camera.translateX(0.4),
            'e': () => camera.translateY(0.4),
            'q': () => camera.translateY(-0.4),
        }
        for (const key of pressedKeys) {
            Handlers[key.toLowerCase()]?.();
        }
        console.log('duck', pressedKeys)
    })

    return <PointerLockControls
        domElement={dom.current}
        ref={control}
    />;
};

const CanvasLayout = ({ children }: CanvasLayoutProps) => {
    const dom = useStore((state) => state.dom);

    return (
        <Canvas
            style={{
                position: "absolute",
                top: 0,
                touchAction: "none",
                // color from blender world theme
                backgroundColor: "rgb(50,50,50)",
            }}
            camera={{
                position: [0, 10, 10],
            }}
            /* @ts-ignore */
            onCreated={(state) => state.events.connect(dom.current)}
        >
            <Preload all />
            <Controls />
            {children}
            <Perf position={"bottom-left"} />
        </Canvas>
    );
};

export default CanvasLayout;

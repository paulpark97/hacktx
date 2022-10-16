import type { NextPage } from "next";
import styled from "styled-components";
import { useControls } from "leva";
import CanvasLayout from "../components/layout/CanvasLayout";
import DomLayout from "../components/layout/DomLayout";
import { LegoContainer, LegoPiece } from "../components/canvas/LegoPiece";
import { Points } from "@react-three/drei";
import * as THREE from 'three';
import Crosshair from "../components/canvas/Crosshair";

// dom components go here
const DOM = () => {
    return (
        <DomLayout>
        </DomLayout>
    );
};

// canvas components go here
const R3F = () => {
    // Leva's useControl causes the ReactDOM.render warning that shows in the console
    //comment out if u dont want error
    // const { color, hoverColor } = useControls({
    //     color: "#c1b61f",
    //     hoverColor: "#2d52ad",
    // });

    const pieces: JSX.Element[] = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 1; j++) {
            for (let k = 0; k < 5; k++) {
                pieces.push(<LegoPiece
                    pieceId={`${i}-${j}-${k}`}
                    position={[(i - 3 / 2) * 7, 0, (k - 3 / 2) * 7]}
                    depth={Math.ceil(Math.random() * 3) * 2}
                    width={Math.ceil(Math.random() * 3) * 2 - 1}
                    color={`#${Math.floor(Math.random() * 16700000).toString(16).padStart(6, '0')}`}
                />)
            }
        }
    }

    return (
        <CanvasLayout>
            <ambientLight />
            <hemisphereLight args={[0xeeeeff, 0x777788, 0.75]} />
            <directionalLight color="white" position={[50, 100, 200]} intensity={.25} />
            <LegoContainer>
                {pieces}
            </LegoContainer>
            <Crosshair />
        </CanvasLayout>
    );
};

const Home: NextPage = () => {
    return (
        <>
            <DOM />
            <R3F />
        </>
    );
};

export default Home;

import { useRef, useEffect, useState } from "react";

export function usePressedKeys() {
    const [state, setState] = useState(new Set<string>());
    function onKeyDown(e: KeyboardEvent) {
        setState(oldState => new Set([...oldState, e.key]));

        //   // document.addEventListener('keydown', (e: KeyboardEvent) => {
        //   //     if (e.keyCode == 'something' && e.ctrlKey && e.shiftKey)
        //   // }); 
    }
    function onKeyUp(e: KeyboardEvent) {
        setState(oldState => new Set([...oldState].filter(k => k !== e.key)));
    }
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    });
    return state;
}

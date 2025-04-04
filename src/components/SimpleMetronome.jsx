'use client';
import { useState, useRef, useEffect } from 'react';

export default function SimpleMetronome() {
    const [rotation, setRotation] = useState(-45);
    const [beatIndex, setBeatIndex] = useState(1);
    
    const audioContext = useRef(null);
    const audioHiBuffer = useRef(null);
    const audioLoBuffer = useRef(null);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

        const loadAudio = async () => {
            const hiResponse = await fetch('/sfx/click_hi.mp3');
            const hiArrayBuffer = await hiResponse.arrayBuffer();
            audioHiBuffer.current = await audioContext.current.decodeAudioData(hiArrayBuffer);
            
            const loResponse = await fetch('/sfx/click_lo.mp3');
            const loArrayBuffer = await loResponse.arrayBuffer();
            audioLoBuffer.current = await audioContext.current.decodeAudioData(loArrayBuffer);
        };
        loadAudio();
    }, []);


    function clickOnce() {
        console.log(beatIndex);
        setRotation((prev) => (prev === -45 ? 45 : -45));

        const buffer = beatIndex === 1 ? audioHiBuffer.current : audioLoBuffer.current;
        if (buffer) {
            const source = audioContext.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.current.destination);
            source.start(audioContext.current.currentTime);
        }
        if (beatIndex < 4) {
            setBeatIndex(beatIndex + 1);
        } else {
            setBeatIndex(1);
        }
    }

    return (
        <div className="flex flex-col items-center" onClick={clickOnce}>
            <div className="relative bg-persian-pink w-12 h-32 md:w-[91px] md:h-[246px] flex items-center justify-center"
                style={{
                    clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
            ></div>
            <div
                className={`absolute w-1 h-20 md:w-[8px] md:h-[160px] rounded-xl bg-cultured transition-transform ease-linear`}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'bottom center',
                    transitionDuration: `${250}ms`,
                }}
            ></div>
        </div>
    );
} 
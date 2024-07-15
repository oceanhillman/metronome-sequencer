'use client'

import { useState, useEffect, useRef } from "react";

export default function Metronome() {
    const [bpm, setBpm] = useState(120);
    const [playing, setPlaying] = useState(false);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [rotation, setRotation] = useState(-45);
    const [tapTimes, setTapTimes] = useState([]);
    const [currentBeat, setCurrentBeat] = useState(0);
    const audioHi = useRef(null);
    const audioLo = useRef(null);
    const intervalIdRef = useRef(null);
    const lastClickTimeRef = useRef(null);

    function getInterval(bpm) {
        return 60 / bpm * 1000;
    }

    useEffect(() => {
        // Initialize the audio objects on the client side
        audioHi.current = new Audio("/sfx/click_hi.wav");
        audioLo.current = new Audio("/sfx/click_lo.wav");
    }, []);

    const playClick = () => {
        const now = Date.now();
        lastClickTimeRef.current = now;

        if (intervalIdRef.current) {
            clearTimeout(intervalIdRef.current);
        }

        setRotation((prev) => (prev === -45 ? 45 : -45));

        setCurrentBeat((prevBeat) => {
            const newBeat = prevBeat % beatsPerMeasure;
            if (newBeat === 0) {
                audioHi.current.currentTime = 0; // Reset audio
                audioHi.current.play();
            } else {
                audioLo.current.currentTime = 0; // Reset audio
                audioLo.current.play();
            }
            return newBeat + 1;
        });

        intervalIdRef.current = setTimeout(playClick, getInterval(bpm));
    };

    useEffect(() => {
        if (playing) {
            lastClickTimeRef.current = Date.now();
            playClick();
        } else {
            clearTimeout(intervalIdRef.current);
        }
        return () => {
            clearTimeout(intervalIdRef.current);
            setCurrentBeat(0);
        };
    }, [playing]);

    useEffect(() => {
        if (playing) {
            const elapsedTime = Date.now() - lastClickTimeRef.current;
            const remainingTime = getInterval(bpm) - elapsedTime;
            
            if (remainingTime <= 0) {
                playClick();
            } else {
                clearTimeout(intervalIdRef.current);
                intervalIdRef.current = setTimeout(playClick, remainingTime);
            }
        }
    }, [bpm, beatsPerMeasure]);

    useEffect(() => {
        if(bpm <= 0 || beatsPerMeasure <= 0)
            setPlaying(false);
    }, [bpm, beatsPerMeasure, playing]);


    const handleTap = () => {
        setPlaying(false);
        const now = Date.now();

        audioHi.current.currentTime = 0; // Reset audio
        audioHi.current.play();
        
        setTapTimes((prev) => {
            const updatedTaps = [...prev, now];
            if (updatedTaps.length > 5) {
                updatedTaps.shift();
            }
            const intervals = updatedTaps.map((time, index) =>
                index > 0 ? time - updatedTaps[index - 1] : 0
            ).filter(interval => interval > 0);
            if (intervals.length > 0) {
                const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
                const newBpm = Math.round(60000 / avgInterval);
                setBpm(newBpm > 300 ? 300 : newBpm); // Limit BPM to 300
            }
            return updatedTaps;
        });
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
                <div className="relative bg-slate-400 w-24 h-60 flex items-center justify-center"
                    style={{
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                    }}
                ></div>
                <div
                    className={`absolute w-1 h-40 rounded-xl bg-white transition-transform ease-linear`}
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'bottom center',
                        transitionDuration: `${getInterval(bpm)}ms`,
                    }}
                ></div>
            </div>
            <p className="text-white mt-4">BPM</p>
            <input
                className="text-black"
                id="bpm"
                type="number"
                max={300}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
            <p className="text-white">Beats per measure</p>
            <input
                className="text-black"
                id="beatsPerMeasure"
                type="number"
                min={0}
                max={64}
                value={beatsPerMeasure}
                onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
            />
            <br />
            <button onClick={() => setPlaying(!playing)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                {playing ? 'Stop' : 'Play'}
            </button>
            <button onClick={handleTap} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                Tap Tempo
            </button>
        </div>
    );
}

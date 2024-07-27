'use client'

import { useState, useEffect, useRef } from "react"
import NumberInput from "@/components/NumberInput";

export default function Metronome(props) {
    const [bpm, setBpm] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [numMeasures, setNumMeasures] = useState(0);
    const [currentBeat, setCurrentBeat] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [rotation, setRotation] = useState(-45);
    const [tapTimes, setTapTimes] = useState([]);

    const audioContext = useRef(null);
    const audioHiBuffer = useRef(null);
    const audioLoBuffer = useRef(null);
    const intervalIdRef = useRef(null);
    const lastClickTimeRef = useRef(null);
    const playlistTimerRef = useRef(null);

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

    function getInterval(bpm) {
        return 60 / bpm * 1000;
    }

    useEffect(() => {
        if (playing) {
            lastClickTimeRef.current = performance.now();
            playMetronome();
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
            const elapsedTime = performance.now() - lastClickTimeRef.current;
            const remainingTime = getInterval(bpm) - elapsedTime;

            if (remainingTime <= 0) {
                playMetronome();
            } else {
                clearTimeout(intervalIdRef.current);
                intervalIdRef.current = setTimeout(playMetronome, remainingTime);
            }
        }
    }, [bpm, beatsPerMeasure]);

    useEffect(() => {
        if(bpm <= 0 || beatsPerMeasure <= 0)
            setPlaying(false);
    }, [bpm, beatsPerMeasure, playing]);

    const playMetronome = () => {
        const now = audioContext.current.currentTime;
        lastClickTimeRef.current = performance.now();

        if (intervalIdRef.current) {
            clearTimeout(intervalIdRef.current);
        }

        setRotation((prev) => (prev === -45 ? 45 : -45));

        setCurrentBeat((prevBeat) => {
            const newBeat = prevBeat % beatsPerMeasure;
            const buffer = newBeat === 0 ? audioHiBuffer.current : audioLoBuffer.current;

            if (buffer) {
                const source = audioContext.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.current.destination);
                source.start(now);
            }

            return newBeat + 1;
        });

        intervalIdRef.current = setTimeout(playMetronome, getInterval(bpm));
    };

    const handleTap = () => {
        setPlaying(false);
        const now = performance.now();

        const source = audioContext.current.createBufferSource();
        source.buffer = audioHiBuffer.current;
        source.connect(audioContext.current.destination);
        source.start(audioContext.current.currentTime);

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

    useEffect(() => {
        if (props.performing === true) {
            performPlaylist(props.playlist);
        } else {
            stopPerformance();
        }
    }, [props.performing]);

    function stopPerformance() {
        clearTimeout(playlistTimerRef.current);
        props.onNextPattern("");
    };

    function performPlaylist(playlist) {
        let patternIndex = 0;
        let measureIndex = 0;
        let beatIndex = 0;

        function playClick() {
            const currentPattern = playlist[patternIndex];
            props.onNextPattern(playlist[patternIndex].id)

            if (beatIndex === 0) {
                setBpm(currentPattern.bpm);
                setBeatsPerMeasure(currentPattern.beatsPerMeasure);
                setNumMeasures(currentPattern.numMeasures);
            }

            setRotation((prev) => (prev === -45 ? 45 : -45));

            const buffer = beatIndex % currentPattern.beatsPerMeasure === 0 ? audioHiBuffer.current : audioLoBuffer.current;
            if (buffer) {
                const source = audioContext.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.current.destination);
                source.start(audioContext.current.currentTime);
            }

            beatIndex++;

            if (beatIndex >= currentPattern.beatsPerMeasure) {
                beatIndex = 0;
                measureIndex++;
                if (measureIndex >= currentPattern.numMeasures) {
                    measureIndex = 0;
                    patternIndex++;
                    if (patternIndex >= playlist.length) {
                        if (props.onPlaylistEnd) {
                            props.onPlaylistEnd();
                        }
                        return;
                    }
                }
            }

            playlistTimerRef.current = setTimeout(playClick, getInterval(currentPattern.bpm));
        }
        playClick();
    }

    return (
        <div className="flex flex-col items-center text-cultured">
            <div className="flex flex-col items-center">
                <div className="relative bg-persian-pink w-12 h-32 flex items-center justify-center"
                    style={{
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                    }}
                ></div>
                <div
                    className={`absolute w-1 h-20 rounded-xl bg-cultured transition-transform ease-linear`}
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'bottom center',
                        transitionDuration: `${getInterval(bpm)}ms`,
                    }}
                ></div>
                {/* <div className="flex flex-row mt-4 flex-wrap">
                    {Array.from({ length: beatsPerMeasure }, (_, index) => (
                        <div key={index} className={`${beatIndex === index ? "bg-red-500" : "bg-white" } h-4 w-4 rounded-full mx-1`}></div>
                    ))}
                </div> */}
            </div>
            <div className="flex flex-row mt-3">
                <div className="flex flex-col justify-center items-center mx-2">
                    <p className="text-cultured m-0">BPM</p>
                    <NumberInput
                        name="metronomeBpm"
                        value={bpm}
                        min={0}
                        max={300}
                        onChange={(e) => setBpm(Number(e.target.value))}
                    />
                </div>
                <div className="flex flex-col justify-center items-center mx-2">
                    <p className="text-cultured m-0">Beats per measure</p>
                    <NumberInput
                        name="metronomeBeatsPerMeasure"
                        value={beatsPerMeasure}
                        min={0}
                        max={64}
                        onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="flex flex-row ">
                <button onClick={() => setPlaying(!playing)} className="mt-2 bg-muted-blue text-white px-2 py-1 rounded mx-2">
                    {playing ? 'Stop Click' : 'Play Click'}
                </button>
                <button onClick={handleTap} className="mt-2 bg-muted-blue text-white px-4 py-1 rounded mx-2">
                    Tap Tempo
                </button>
            </div>
        </div>
    );
}

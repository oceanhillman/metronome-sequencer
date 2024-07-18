'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Metronome from "@/components/Metronome"
import Playlist from "@/components/Playlist"
import PlusIcon from "/public/plus.svg"

function generatePatternId() {
    return String(Math.round(Date.now() + Math.random()));
}

export default function Editor() {

    const [performing, setPerforming] = useState(false);
    const [playlist, setPlaylist] = useState([{
        id: generatePatternId(),
        bpm: 120,
        beatsPerMeasure: 4,
        numMeasures: 4,
    }]);
    const [currentPattern, setCurrentPattern] = useState();

    function updateCurrentPattern(patternId) {
        setCurrentPattern(patternId);
        console.log(patternId);
    }

    // Clear all patterns from playlist
    function handleClear() {
        setPlaylist([]);
    }

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (playlist.length > 0)
            setPerforming(!performing);
    }

    // Callback for when playlist has finished playing
    function handlePlaylistEnd() {
        setPerforming(false);
    };

    // Add new pattern with default values
    function initalizeNewPattern() {
        const newPattern = {
            id: generatePatternId(),
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        setPlaylist((prev) => [...prev, newPattern]);
    }

    // Callback for returning updates from Playlist component 
    function handleUpdatePlaylist(playlistData) {
        setPlaylist(playlistData);
    }

    function handleClonePattern(patternData) {
        const clonedPattern = {
            id: generatePatternId(),
            bpm: patternData.bpm,
            beatsPerMeasure: patternData.beatsPerMeasure,
            numMeasures: patternData.numMeasures,
        }
        setPlaylist((prev) => [...prev, clonedPattern]);
    }

    return (
        <div className="w-full mt-16">
            <div className="">
                <Metronome
                    playlist={playlist}
                    performing={performing}
                    onPlaylistEnd={handlePlaylistEnd}
                    onNextPattern={updateCurrentPattern}
                />
                <div className="flex flex-col justify-center mt-16">
                    <div className="flex items-center justify-center">
                        <button onClick={(handleClickPlay)} className="mt-2 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
                            {performing ? "Stop" : "Start performance"}
                        </button>
                        <button onClick={handleClear} className="mt-2 mx-2 bg-red-700 text-white px-4 py-2 rounded">
                            Clear
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-[100%] md:w-[80%] lg:w-[80%]">
                            <Playlist 
                                playlistData={playlist}
                                handleUpdatePlaylist={handleUpdatePlaylist}
                                handleClonePattern={handleClonePattern}
                                currentPatternId={currentPattern}
                            />
                        </div>
                        <button onClick={initalizeNewPattern} className="mt-2 bg-[#1C2025] border-[#303740] border-[1px] hover:bg-[#0059B2] hover:border-[#007fff] p-3 rounded-full">
                            <Image src={PlusIcon} alt="Plus icon" className="w-auto h-auto"/>
                        </button>
                    </div>     
                </div>
            </div>
        </div>
    )
}
'use client'

import { useState, useEffect, useRef } from "react"
import Metronome from "@/components/Metronome"
import GridLayout from "react-grid-layout"
import Pattern from "@/components/Pattern"


export default function Playlist() {

    const [editingBpm, setEditingBpm] = useState(120);
    const [editingBeatsPerMeasure, setEditingBeatsPerMeasure] = useState(4);
    const [editingNumMeasures, setEditingNumMeasures] = useState(1);
    const [playlist, setPlaylist] = useState([]);
    const [sequencing, setSequencing] = useState(false);

    // Enforce reasonable limits on metronome parameters
    useEffect(() => {
        if (editingNumMeasures <= 0)
            setEditingNumMeasures(1);
        else if (editingNumMeasures > 128)
            setEditingNumMeasures(128);

        if (editingBeatsPerMeasure <= 0)
            setEditingBeatsPerMeasure(1);
        else if (editingBeatsPerMeasure > 64)
            setEditingBeatsPerMeasure(64);

        if (editingBpm <= 0)
            setEditingBpm(1);
        else if (editingBpm > 300)
            setEditingBpm(300);
    }, [editingBpm, editingBeatsPerMeasure, editingNumMeasures]);

    // Add pattern to playlist
    function handleAddPattern() {
        setPlaylist((prev) => [...prev, {
                id: Date.now(),
                bpm: editingBpm,
                beatsPerMeasure: editingBeatsPerMeasure,
                numMeasures: editingNumMeasures,
            }
        ]);
    }

    // Clear all patterns from playlist
    function handleClear() {
        setPlaylist([]);
    }

    // Delete a single pattern from playlist
    function handleDelete(id) {
        setPlaylist((prevItems) => prevItems.filter(item => item.id !== id));
    }

    // Trigger metronome to play playlist
    function beginSequencing() {
        setSequencing(!sequencing);
    }

    // Callback for when playlist has finished playing
    function handleSequenceEnd() {
        setSequencing(false);
    };

    const [layoutData, setLayoutData] = useState([]);

    function updateLayout() {
        const updatedLayoutData = patternData.map((pattern, index) => ({
            i: pattern.id,
            x: 0,
            y: index,
            w: 1,
            h: 1,
            isResizable: false,
            isDraggable: true,
        }));
        setLayoutData(updatedLayoutData);
    }

    function generatePatternId() {
        return String(Math.round(Date.now() + Math.random()));
    }

    const [patternData, setPatternData] = useState([{
        id: generatePatternId(),
        bpm: 120,
        timeSignature: [4, 4],
        numMeasures: 4,
    },
    ]);

    useEffect(() => {
        updateLayout();
    }, [patternData]);

    function initalizeNewPattern() {
        const newPattern = {
            id: generatePatternId(),
            bpm: 120,
            timeSignature: [3, 4],
            numMeasures: 4,
        };
        setPatternData((prev) => [...prev, newPattern]);
    }

    return (
        <div className="w-screen">
            <div className="w-full">
                {/* <Metronome
                    playlist={playlist}
                    sequencing={sequencing}
                    onSequenceEnd={handleSequenceEnd}
                /> */}
                <div className="flex flex-col justify-center mx-96">                
                    <GridLayout
                        className="layout flex flex-col justify-center items-center h-full mx-96 bg-white"
                        layout={layoutData}
                        cols={1}
                        rowHeight={50}
                        width={1200}
                        onLayoutChange={(layout) => updateLayout()}
                    >
                        {patternData.map(pattern => (
                            <div key={pattern.id} className="h-full">
                                <Pattern
                                    key={pattern.id}
                                    id={pattern.id}
                                    dataGrid={layoutData.find((layout) => layout.i === pattern.id)}
                                    bpm={pattern.bpm}
                                    timeSignature={pattern.timeSignature}
                                    numMeasures={pattern.numMeasures}
                                />
                            </div>
                        ))}
                    </GridLayout>
                    <button onClick={initalizeNewPattern} className="mt-2 bg-slate-700 text-white text-sm px-1 py-1 rounded">
                        +
                    </button>
                    {/*<div className="cursor-move rounded-lg w-[600px] h-[150px] bg-blue-800">
                        <div className="absolute grid grid-cols-3 rounded-b-lg w-[600px] h-[130px] translate-y-5 bg-slate-300">
                            <div>
                                <label className="text-xl text-black">BPM: </label>
                                <input
                                    className="text-black text-xl w-[50px] bg-transparent"
                                    type="number"
                                    max={300}
                                    value={editingBpm}
                                    onChange={(e) => setEditingBpm(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-xl text-black">Beats per measure: </label>
                                <input
                                    className="text-black text-xl w-[50px] bg-transparent"
                                    type="number"
                                    max={64}
                                    value={editingBeatsPerMeasure}
                                    onChange={(e) => setEditingBeatsPerMeasure(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-xl text-black"> # of measures </label>
                                <input
                                    className="text-black"
                                    type="number"
                                    max={64}
                                    value={editingNumMeasures}
                                    onChange={(e) => setEditingNumMeasures(Number(e.target.value))}
                                />
                            </div>
                            <div></div>
                            <button onClick={handleAddPattern} className="bg-blue-500 text-white rounded">
                                Add to playlist
                            </button>
                            <div></div>
                        </div>
                    </div>*/}
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button onClick={(beginSequencing)} className="mt-2 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
                    {sequencing ? "Stop" : "Play sequence"}
                </button>
                <button onClick={handleClear} className="mt-2 mx-2 bg-red-700 text-white px-4 py-2 rounded">
                    Clear
                </button>
            </div>
            <div className="flex items-center justify-center">
                <ol type="1">
                    {playlist.map(item => (
                        <li key={item.id}>
                            {playlist.indexOf(item) + 1}. {item.numMeasures} measures of {item.beatsPerMeasure} beats at {item.bpm} BPM
                            <span> </span>
                            <button onClick={() => handleDelete(item.id)} className="mt-2 bg-slate-700 text-white text-sm px-1 py-1 rounded">
                                Delete
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
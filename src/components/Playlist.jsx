'use client'


import "../app/globals.css";
import { useState, useEffect, useRef } from "react"
import Metronome from "@/components/Metronome"
import GridLayout from "react-grid-layout"
import { WidthProvider, Responsive } from 'react-grid-layout';
import Pattern from "@/components/Pattern"

const ResponsiveGridLayout = WidthProvider(Responsive);

function generatePatternId() {
    return String(Math.round(Date.now() + Math.random()));
}

export default function Playlist() {

    const [editingBpm, setEditingBpm] = useState(120);
    const [editingBeatsPerMeasure, setEditingBeatsPerMeasure] = useState(4);
    const [editingNumMeasures, setEditingNumMeasures] = useState(1);
    const [sequencing, setSequencing] = useState(false);
    const [layoutData, setLayoutData] = useState([]);
    const [playlist, setPlaylist] = useState([{
        id: generatePatternId(),
        bpm: 120,
        beatsPerMeasure: 4,
        numMeasures: 4,
    },
    ]);

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

    // Clear all patterns from playlist
    function handleClear() {
        setPlaylist([]);
    }

    // Delete a single pattern from playlist
    function handleClickDelete(event, id) {
        event.stopPropagation();
        setPlaylist((prevItems) => prevItems.filter(item => item.id !== id));
    }

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (playlist.length > 0)
            setSequencing(!sequencing);
    }

    // Callback for when playlist has finished playing
    function handleSequenceEnd() {
        setSequencing(false);
    };

    function sortLayout(layout) {
        // Sort the layout by the y value (and x if necessary)
        const sortedLayout = layout.sort((a, b) => {
            if (a.y === b.y) {
                return a.x - b.x; // Secondary sort by x if y values are the same
            }
            return a.y - b.y;
        });
        return sortedLayout;
    }

    function reorderPlaylist(newLayout) {
        // Map sorted layout to reorder the playlist
        const newPlaylistOrder = newLayout.map(item =>
            playlist.find(pattern => pattern.id === item.i)
        ).filter(Boolean);
        
        setPlaylist(newPlaylistOrder);
    }

    function initalizeNewPattern() {
        const newPattern = {
            id: generatePatternId(),
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        setPlaylist((prev) => [...prev, newPattern]);
    }

    function handleUpdatePattern(id, attribute, value) {
        setPlaylist((prev) =>
            prev.map((pattern) =>
                pattern.id === id ? { ...pattern, [attribute]: value } : pattern
            )
        );
    }

    function handleLayoutChange(layout) {
        const sortedLayout = sortLayout(layout);
        setLayoutData(sortedLayout);

        reorderPlaylist(sortedLayout);
    }

    return (
        <div className="w-screen">
            <div className="">
                <Metronome
                    playlist={playlist}
                    sequencing={sequencing}
                    onSequenceEnd={handleSequenceEnd}
                />
                <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                        <button onClick={(handleClickPlay)} className="mt-2 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
                            {sequencing ? "Stop" : "Play sequence"}
                        </button>
                        <button onClick={handleClear} className="mt-2 mx-2 bg-red-700 text-white px-4 py-2 rounded">
                            Clear
                        </button>
                        <button onClick={initalizeNewPattern} className="mt-2 bg-slate-700 text-white text-sm px-1 py-1 rounded">
                            +
                        </button> 
                    </div>
                    <div>
                        <ResponsiveGridLayout
                            className="layout mx-96"
                            layout={layoutData}
                            cols={{xxl:1, xl:1, lg:1, md:1, sm:1, xs:1, xxs:1}}
                            rowHeight={100}
                            width={""}
                            onLayoutChange={(layout) => handleLayoutChange(layout)}
                        >
                            {playlist.map(pattern => (
                                <div key={pattern.id} className="h-full">
                                    <Pattern
                                        key={pattern.id}
                                        dataGrid={layoutData.find(layout => layout.i === pattern.id)}
                                        patternData={pattern}
                                        handleUpdatePattern={handleUpdatePattern}
                                        handleClickDelete={handleClickDelete}
                                    />
                                </div>
                            ))}
                        </ResponsiveGridLayout>
                    </div>     
                    
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
                <ol type="1">
                    {playlist.map(item => (
                        <li key={item.id}>
                            {playlist.indexOf(item) + 1}. {item.numMeasures} measures of {item.beatsPerMeasure} beats at {item.bpm} BPM
                            <span> </span>
                            
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
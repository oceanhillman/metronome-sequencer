'use client'


import "../app/globals.css";
import { useState, useEffect, useRef } from "react"
import Metronome from "@/components/Metronome"
import GridLayout from "react-grid-layout"
import { WidthProvider, Responsive } from 'react-grid-layout';
import Pattern from "@/components/Pattern"
import Playlist from "@/components/Playlist"

const ResponsiveGridLayout = WidthProvider(Responsive);

function generatePatternId() {
    return String(Math.round(Date.now() + Math.random()));
}

export default function Editor() {

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

    // Sort the layout by the y value (and x if necessary)
    function sortLayout(layout) {
        const sortedLayout = layout.sort((a, b) => {
            if (a.y === b.y) {
                return a.x - b.x; // Secondary sort by x if y values are the same
            }
            return a.y - b.y;
        });
        return sortedLayout;
    }

    // Reorder playlist to match layout order
    function reorderPlaylist(newLayout) {
        const newPlaylistOrder = newLayout.map(item =>
            playlist.find(pattern => pattern.id === item.i)
        ).filter(Boolean);
        
        setPlaylist(newPlaylistOrder);
    }

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

    // Callback function for Pattern component
    function handleUpdatePattern(id, attribute, value) {
        setPlaylist((prev) =>
            prev.map((pattern) =>
                pattern.id === id ? { ...pattern, [attribute]: value } : pattern
            )
        );
    }

    // Callback function for onLayoutChange 
    function handleLayoutChange(layout) {
        const sortedLayout = sortLayout(layout);
        setLayoutData(sortedLayout);

        reorderPlaylist(sortedLayout);
    }

    function handleUpdatePlaylist(playlistData) {
        setPlaylist(playlistData);
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
                        <Playlist 
                            playlistData={playlist}
                            handleUpdatePlaylist={handleUpdatePlaylist}
                        />
                    </div>     
                </div>
            </div>
        </div>
    )
}
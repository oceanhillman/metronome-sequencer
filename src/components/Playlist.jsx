'use client'

import { useState, useEffect, useRef } from "react"
import Metronome from "@/components/Metronome"

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

    return (
        <div>
            <div>
                <Metronome
                    playlist={playlist}
                    sequencing={sequencing}
                    onSequenceEnd={handleSequenceEnd}
                />
                <label> # of measures </label>
                <input
                    className="text-black"
                    type="number"
                    max={64}
                    value={editingNumMeasures}
                    onChange={(e) => setEditingNumMeasures(Number(e.target.value))}
                />
                <label> Beats per measure </label>
                <input
                    className="text-black"
                    type="number"
                    max={64}
                    value={editingBeatsPerMeasure}
                    onChange={(e) => setEditingBeatsPerMeasure(Number(e.target.value))}
                />
                <label> BPM </label>
                <input
                    className="text-black"
                    type="number"
                    max={300}
                    value={editingBpm}
                    onChange={(e) => setEditingBpm(Number(e.target.value))}
                />
                <span> </span>
                <button onClick={handleAddPattern} className="mt-2 bg-amber-700 text-white px-4 py-2 rounded">
                    Add to playlist
                </button>
                <span> </span>
                <button onClick={handleClear} className="mt-2 bg-red-700 text-white px-4 py-2 rounded">
                    Clear
                </button>
            </div>
            <div className="flex items-center justify-center">
                <button onClick={(beginSequencing)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                    {sequencing ? "Stop" : "Play sequence"}
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
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

export default function Playlist(props) {
    const { playlistData, handleUpdatePlaylist } = props;
    const [sequencing, setSequencing] = useState(false);
    const [layoutData, setLayoutData] = useState([]);

    // Clear all patterns from playlist
    function handleClear() {
        handleUpdatePlaylist([]);
    }

    // Delete a single pattern from playlist
    function handleClickDelete(event, id) {
        event.stopPropagation();
        handleUpdatePlaylist((prevItems) => prevItems.filter(item => item.id !== id));
    }

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (playlistData.length > 0)
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
            playlistData.find(pattern => pattern.id === item.i)
        ).filter(Boolean);
        
        handleUpdatePlaylist(newPlaylistOrder);
    }

    // Add new pattern with default values
    function initalizeNewPattern() {
        const newPattern = {
            id: generatePatternId(),
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        handleUpdatePlaylist((prev) => [...prev, newPattern]);
    }

    // Callback function for onLayoutChange 
    function handleLayoutChange(layout) {
        const sortedLayout = sortLayout(layout);
        setLayoutData(sortedLayout);

        reorderPlaylist(sortedLayout);
    }

    // Callback function for Pattern component
    function handleUpdatePattern(id, attribute, value) {
        handleUpdatePlaylist((prev) =>
            prev.map((pattern) =>
                pattern.id === id ? { ...pattern, [attribute]: value } : pattern
            )
        );
    }

    return (
        <ResponsiveGridLayout
            className="layout mx-96"
            layout={layoutData}
            cols={{xxl:1, xl:1, lg:1, md:1, sm:1, xs:1, xxs:1}}
            rowHeight={100}
            width={""}
            onLayoutChange={(layout) => handleLayoutChange(layout)}
        >
            {playlistData.map(pattern => (
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
    )
}
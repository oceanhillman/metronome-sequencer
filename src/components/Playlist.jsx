'use client'

import "../app/globals.css";
import { useState } from "react"
import { WidthProvider, Responsive } from 'react-grid-layout';
import Pattern from "@/components/Pattern"

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Playlist(props) {
    const { playlistData, handleUpdatePlaylist, handleClonePattern, currentPatternId, onUpdateLayout, performing, startFromPattern } = props;
    const [layoutData, setLayoutData] = useState([]);

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

    // Callback function for onLayoutChange 
    function handleLayoutChange(layout) {
        const sortedLayout = sortLayout(layout);
        setLayoutData(sortedLayout);
        onUpdateLayout(sortedLayout);
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

    // Delete a single pattern from playlist
    function handleClickDelete(event, id) {
        event.stopPropagation();
        handleUpdatePlaylist((prevItems) => prevItems.filter(item => item.id !== id));
    }

    function handleClickClone(event, pattern) {
        event.stopPropagation();
        handleClonePattern(pattern);
    }

    function handleDragStart () {
        document.body.classList.add('disable-select');
    };
    
    function handleDragStop () {
        document.body.classList.remove('disable-select');
    };

    return (
        <ResponsiveGridLayout
            className="layout bg-chinese-black border-2 border-arsenic rounded-xl px-[2px] lg:px-4 mt-2 lg:mt-4"
            layout={layoutData}
            cols={{xxl:1, xl:1, lg:1, md:1, sm:1, xs:1, xxs:1}}
            rowHeight={120}
            margin={[0, 20]}
            width={"100%"}
            onLayoutChange={(layout) => handleLayoutChange(layout)}
            draggableHandle=".handle" // This makes the first div draggable
            draggableCancel=".no-drag" // This makes the second div non-draggable
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            transitionDuration={0}
        >
            {playlistData.map(pattern => (
                <div key={pattern.id} className="h-full">
                    <Pattern
                        key={pattern.id}
                        dataGrid={layoutData.find(layout => layout.i === pattern.id)}
                        patternData={pattern}
                        handleUpdatePattern={handleUpdatePattern}
                        handleClickDelete={handleClickDelete}
                        handleClickClone={handleClickClone}
                        currentPatternId={currentPatternId}
                        performing={performing}
                        startFromPattern={startFromPattern}
                    />
                </div>
            ))}
        </ResponsiveGridLayout>          
    )
}
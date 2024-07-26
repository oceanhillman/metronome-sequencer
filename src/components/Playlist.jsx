import { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Pattern from './Pattern';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Playlist = ({ song, addToHistory, handleUpdatePlaylist, handleUpdateLayout, handleUpdatePattern, handleClickDelete, handleClone, currentPatternId, performing, startFromPattern }) => {
    const [gridLayout, setGridLayout] = useState([]);
    const [settingFromHere, setSettingFromHere] = useState(false);
    const isManualChange = useRef(false);

    useEffect(() => {
        if (!settingFromHere) {
            setGridLayout(song.layout);
            handleUpdateLayout(song.layout);
        }
    }, [song.layout]);

      useEffect(() => {
        setSettingFromHere(false);
      }, [settingFromHere])

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
            song.playlist.find(pattern => pattern.id === item.i)
        ).filter(Boolean);
        
        handleUpdatePlaylist(newPlaylistOrder);
    }

    // happens when user changes ui.
    const handleLayoutChange = (layout) => {
        setSettingFromHere(true);
        handleUpdateLayout(layout);
        reorderPlaylist(layout);
        setGridLayout(layout);
        if (isManualChange.current) {
            addToHistory(song);
            isManualChange.current = false;
        }
    }

    
        
    function handleDragStart () {
        isManualChange.current = true;
        document.body.classList.add('disable-select');
    };
    
    function handleDragStop () {
        document.body.classList.remove('disable-select');
    };
    
    return song && song.playlist ? (
        <ResponsiveGridLayout
            className="layout bg-black border-2 border-arsenic rounded-xl px-[2px] lg:px-4 mt-2 lg:mt-4"
            layouts={{xxl: gridLayout, xl: gridLayout, lg: gridLayout, md: gridLayout, sm: gridLayout, xs: gridLayout, xxs: gridLayout}}
            cols={{xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1, xxs: 1}}
            rowHeight={120}
            margin={[0, 20]}
            width={"100%"}
            onLayoutChange={(layout, layouts) => handleLayoutChange(layout)}
            draggableHandle=".handle"
            draggableCancel=".no-drag"
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            transitionDuration={0}
        >
            {song.playlist.map(pattern => {
                const patternLayout = gridLayout.find(layout => layout.i === pattern.id);
                return (
                    <div key={pattern.id} className="h-full">
                        <Pattern
                            key={pattern.id}
                            song={song}
                            dataGrid={patternLayout}
                            addToHistory={addToHistory}
                            patternData={pattern}
                            handleUpdatePattern={handleUpdatePattern}
                            handleClickDelete={handleClickDelete}
                            handleClone={handleClone}
                            currentPatternId={currentPatternId}
                            performing={performing}
                            startFromPattern={startFromPattern}
                        />
                    </div>
                );
            })}
        </ResponsiveGridLayout>
    ) : (
        <p>Loading...</p>
    );
};

export default Playlist;
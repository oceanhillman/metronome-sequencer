'use client'

import Metronome from "@/components/Metronome"
import Playlist from "@/components/Playlist"
import PlusIcon from "/public/plus.svg"

import Image from "next/image"
import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Editor() {

    const { user, error, isLoading } = useUser();
    const [performing, setPerforming] = useState(false);
    const [playlist, setPlaylist] = useState([{
        id: generatePatternId(),
        bpm: 120,
        beatsPerMeasure: 4,
        numMeasures: 4,
    }]);
    const [currentPattern, setCurrentPattern] = useState();
    const [layout, setLayout] = useState([]);
    const [songTitle, setSongTitle] = useState(`Untitled Project #${1}`);

    const [creating, setCreating] = useState(false);
    const [creationError, setCreationError] = useState(null);
    const [creationSuccess, setCreationSuccess] = useState(null);

    // Callback function to update layout
    function updateLayout(layoutData) {
        setLayout(layoutData);
    }

    // Generates a unique identifier
    function generatePatternId() {
        return String(Math.round(Date.now() + Math.random()));
    }

    // Callback function to get the next pattern
    function handleGetNextPattern(patternId) {
        setCurrentPattern(patternId);
        console.log(patternId);
    }

    // Callback for when playlist has finished playing
    function handlePlaylistEnd() {
        setPerforming(false);
    };

    // Clear all patterns from playlist
    function handleClear() {
        setPlaylist([]);
    }

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (playlist.length > 0) {
            setPerforming(!performing);
        }
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

    const [songData, setSongData] = useState({});
    // user_id (get from session)
    // title (get here)
    // created_at (get from db or create here)
    // last saved (get from db or create here)
    // playlist (get here)
    // layout (get from playlist)

    // function updateSong() {
    //     setSongData({
            // user_id: user?.user_id,
            // title: songTitle,
            // created_at: creationTime,
            // last_saved: creationTime,
            // playlist: playlist,
            // layout: layout,
    //     });
    // }

    const createNewSong = async (event) => {
        const now = new Date();
        const creationTime = now.toISOString();
        
        const newSong = {
            user_id: user?.user_id,
            title: songTitle,
            created_at: creationTime,
            last_saved: creationTime,
            playlist: JSON.stringify(playlist),
            layout: JSON.stringify(layout),
        }

        try {
            const response = await fetch('/api/songs/addSong', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newSong), // Replace 'songName' with your actual field
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const result = await response.json();
            setCreationSuccess('Song added successfully!');
            
          } catch (error) {
            setCreationError(`Error: ${error.message}`);
          } finally {
            setCreating(false);
          }
    }

    function saveSong() {
        // song exists? overwrite it
        // song doesn't exist? create it
        
    }

    function handleClickSave() {
        // logged in? save
        createNewSong();
        // not logged in? we should log in, but hold onto the song data
    }

    

    return (
        <div className="w-full mt-16">
            <div className="">
                <Metronome
                    playlist={playlist}
                    performing={performing}
                    onPlaylistEnd={handlePlaylistEnd}
                    onNextPattern={handleGetNextPattern}
                />
                <div className="flex flex-col justify-center mt-16">
                    <Form.Control className="w-[200px] self-center"
                        type="text"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        placeholder={"Song Title"}
                    />
                    <div className="flex items-center justify-center">
                        <button onClick={handleClickSave} className="mt-2 mx-2 bg-green-700 text-white px-4 py-2 rounded">
                            Save
                        </button>
                        <button onClick={handleClickPlay} className="mt-2 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
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
                                onUpdateLayout={updateLayout}
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
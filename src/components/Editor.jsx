'use client'

import Metronome from "@/components/Metronome"
import Playlist from "@/components/Playlist"
import PlusIcon from "/public/plus.svg"
import SaveAsNewButton from "@/components/SaveAsNewButton"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from "next/router"
import Modal from 'react-bootstrap/Modal'
import { title } from "process"


export default function Editor(props) {
    const { songPayload } = props;

    // const router = useRouter();

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
    const [songTitle, setSongTitle] = useState('Untitled Song');

    // when we open up the editor there are some possible scenarios:
    // 1. logged out, new unsaved song      -   initialize a new default song with no id
    // 2. logged in, new unsaved song       -   initialize a new default song with no id
    // 3. logged in, editing existing song  -   get passed a song id and initialize that specific song 

    // for now, just initialize a new default song with no id
    const [song, setSong] = useState({
        id: '',
        title: songTitle,
        playlist: playlist,
        layout: layout,
    });

    const [creating, setCreating] = useState(false);
    const [creationError, setCreationError] = useState(null);
    const [creationSuccess, setCreationSuccess] = useState(null);

    useEffect(() => {
        if (songPayload) {
            setLayout(songPayload.layout);
            setPlaylist(songPayload.playlist);
            setSongTitle(songPayload.songTitle);
        }
    }, [songPayload])

    useEffect(() => {
        setSong(prev => ({
            ...prev,
            title: songTitle,
            layout: layout,
            playlist: playlist
        }));
    }, [songTitle, layout, playlist]);

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
    function initializeNewPattern() {
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
            // title: song.title,
            // created_at: creationTime,
            // last_saved: creationTime,
            // playlist: playlist,
            // layout: layout,
    //     });
    // }

    const createNewSong = async (event) => {
        const now = new Date();
        const creationTime = now.toISOString();
        
        const newSongData = {
            user_id: user?.sub,
            title: songTitle,
            created_at: creationTime,
            last_saved: creationTime,
            playlist: JSON.stringify(song.playlist),
            layout: JSON.stringify(song.layout),
        }

        try {
            const response = await fetch('/api/songs/addSong', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newSongData),
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

    async function updateSong(songId) {
        const now = new Date();
        const updatedTime = now.toISOString();

        const updatedSongData = {
            id: songId,                                 // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            title: songTitle,
            last_saved: updatedTime,
            playlist: JSON.stringify(playlist),
            layout: JSON.stringify(layout),
        };

        try {
            const response = await fetch('/api/songs/updateSong', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSongData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

        } catch (error) {

        } finally {

        };
    }

    function handleSave() {
        updateSong(songId);
    }

    // top shows current song name, or defaults to 'untitled project'
    // clicking saveAsNew gives a prompt to enter the title, and updates the name up top

    // clicking save updates the current song without a prompt

    async function handleSaveAsNew() {
        if (user) {
            try {
                await createNewSong();
                localStorage.removeItem('unsavedProject');
                console.log("removing");
            } catch (error) {
                console.error("Error handling save:", error.message);
            }
        } else {
            console.log("setting ")
            localStorage.setItem('unsavedProject', JSON.stringify(song));
            window.location.href = '/api/auth/login'; // Direct navigation
            // router.push('/api/auth/login');
            
        }
        
        // not logged in? we should log in, but hold onto the song data
    }

    

    useEffect(() => {
        const unsavedProject = localStorage.getItem('unsavedProject'); // Corrected typo
        if (unsavedProject) {
            const unsavedProjectData = JSON.parse(unsavedProject);
            console.log("setting", unsavedProject);

            setLayout(unsavedProjectData.layout);
            setPlaylist(unsavedProjectData.playlist);
            setSongTitle(unsavedProjectData.title);

            setSong(JSON.parse(unsavedProject)); // Parse the string back into an object
        } else {
            console.log("no unsaved project");
        }
    }, []);

    function updateSongTitle(newTitle) {
        setSongTitle(newTitle);
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
                    
                    <div className="flex items-center justify-center">
                        <SaveAsNewButton 
                            song={songTitle}
                            updateSongTitle={updateSongTitle}
                            onSave={handleSaveAsNew}
                        />
                        <Button onClick={handleSave} disabled={true} variant="dark">
                            Save
                        </Button>
                        <button onClick={handleClickPlay} className="mt-2 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
                            {performing ? "Stop" : "Start performance"}
                        </button>
                        <button onClick={handleClear} className="mt-2 mx-2 bg-red-700 text-white px-4 py-2 rounded">
                            Clear
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-[100%] md:w-[80%]">
                            <Playlist 
                                playlistData={playlist}
                                handleUpdatePlaylist={handleUpdatePlaylist}
                                handleClonePattern={handleClonePattern}
                                currentPatternId={currentPattern}
                                onUpdateLayout={updateLayout}
                            />
                        </div>
                        <button onClick={initializeNewPattern} className="mt-2 bg-[#1C2025] border-[#303740] border-[1px] hover:bg-[#0059B2] hover:border-[#007fff] p-3 rounded-full">
                            <Image src={PlusIcon} alt="Plus icon" className="w-auto h-auto"/>
                        </button>
                    </div>     
                </div>
            </div>
        </div>
    )
}
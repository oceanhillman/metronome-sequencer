'use client'
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';

import Metronome from "@/components/Metronome";
import Playlist from "@/components/Playlist";
import SaveAsNewButton from "@/components/SaveAsNewButton";
import UndoRedoButtons from "@/components/UndoRedoButtons";

import PlusIcon from "/public/plus.svg";

import { saveSong, addSong } from '@lib/api';

import { FaPlay, FaStop } from "react-icons/fa6";

const generatePatternId = () => String(Math.round(Date.now() + Math.random()));

export default function Editor(props) {
    const { songPayload } = props;
    const { user, error, isLoading } = useUser();

    const [songTitle, setSongTitle] = useState('Untitled Song');
    const [playlist, setPlaylist] = useState([{
        id: generatePatternId(),
        name: 'Pattern #1',
        bpm: 120,
        beatsPerMeasure: 4,
        numMeasures: 4,
    }]);
    const [layout, setLayout] = useState([]);
    const [song, setSong] = useState({
        id: '',
        title: songTitle,
        playlist: playlist,
        layout: layout,
    });
    const [performing, setPerforming] = useState(false);
    const [currentSection, setCurrentSection] = useState();
    const [currentPattern, setCurrentPattern] = useState();
    
    // Preload any incoming song data
    useEffect(() => {
        if (songPayload) {
            setLayout(songPayload.layout);
            setPlaylist(songPayload.playlist);
            setSongTitle(songPayload.title);
            setSong((prev => ({
                ...prev,
                id: songPayload.id
            })));
        }
    }, [songPayload])

    // Keep song up to date
    useEffect(() => {
        setSong(prev => ({
            ...prev,
            title: songTitle,
            layout: layout,
            playlist: playlist
        }));
    }, [songTitle, layout, playlist]);

    // Load unsaved project from local storage
    useEffect(() => {
        const unsavedProject = localStorage.getItem('unsavedProject');
        if (unsavedProject) {
            const unsavedProjectData = JSON.parse(unsavedProject);

            setLayout(unsavedProjectData.layout);
            setPlaylist(unsavedProjectData.playlist);
            setSongTitle(unsavedProjectData.title);

            setSong(JSON.parse(unsavedProject));
        }
    }, []);

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (playlist.length > 0) {
            setCurrentSection(playlist);
            setPerforming(!performing);
        }
    }

    // Add new pattern with default values
    function initializeNewPattern() {
        const newPattern = {
            id: generatePatternId(),
            name: `Pattern #${playlist.length + 1}`,
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        setPlaylist((prev) => [...prev, newPattern]);
    }

    const handleClonePattern = (patternData) => {
        const clonedPattern = {
            id: generatePatternId(),
            name: `${patternData.name} (clone)`,
            bpm: patternData.bpm,
            beatsPerMeasure: patternData.beatsPerMeasure,
            numMeasures: patternData.numMeasures,
        };
    
        const patternIndex = playlist.findIndex(pattern => pattern.id === patternData.id);
    
        if (patternIndex !== -1) {
            setPlaylist((prev) => [
                ...prev.slice(0, patternIndex + 1),
                clonedPattern,
                ...prev.slice(patternIndex + 1)
            ]);
        } else {
            console.error('Pattern to clone not found');
        }
    };
    

    async function handleSave() {
        if (user && song.id) {
            await saveSong(song.id, user?.sub, songTitle, playlist, layout);
        };
    }

    async function handleSaveAsNew() {
        if (user) {
            try {
                const id = await addSong(user?.sub, songTitle, playlist, layout);
                localStorage.removeItem('unsavedProject');
                window.location.href = `/song/${id}`;
            } catch (error) {
                console.error("Error adding song:", error.message);
            }
        } else {
            localStorage.setItem('unsavedProject', JSON.stringify(song));
            window.location.href = '/api/auth/login';
        }
    }

    function handleStartFromPattern(patternId) {
        const leadingPatternIndex = playlist.findIndex(pattern => pattern.id === patternId);
        setCurrentSection(playlist.slice(leadingPatternIndex));
        setPerforming(true);
    }

    return (
        <div className="w-full mt-6 lg:mt-16">
            <div className="pb-16">
                <Metronome
                    playlist={currentSection}
                    performing={performing}
                    onPlaylistEnd={() => setPerforming(false)}
                    onNextPattern={(patternId) => setCurrentPattern(patternId)}
                />
                <div className="flex flex-col justify-center mt-4 lg:mt-8">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col w-[100%] md:w-[80%] justify-center">
                            <Form.Control className="w-full self-center border-2 bg-black border-arsenic text-cultured font-poppins text-lg rounded-md text-center
                            focus:bg-eerie-black focus:text-cultured focus:border-arsenic focus:ring-2 focus:ring-muted-blue focus:outline-none"
                                type="text"
                                value={songTitle}
                                onChange={(e) => setSongTitle(e.target.value)}
                                placeholder={"Song Title"}
                            />
                            <Playlist 
                                playlistData={playlist}
                                handleUpdatePlaylist={(newPlaylist) => setPlaylist(newPlaylist)}
                                handleClonePattern={handleClonePattern}
                                currentPatternId={currentPattern}
                                onUpdateLayout={(newLayout) => setLayout(newLayout)}
                                performing={performing}
                                startFromPattern={handleStartFromPattern}
                            />
                        </div>
                        <button onClick={initializeNewPattern} className="mt-2 bg-muted-blue hover:bg-arsenic border-2 border-arsenic p-3 rounded-full">
                            <Image src={PlusIcon} alt="Plus icon" className="w-auto h-auto"/>
                        </button>
                    </div>     
                </div>
            </div>

            <div className="sticky bottom-0 bg-eerie-black border-t-2 border-arsenic text-cultured py-4">
                <div className="grid grid-cols-3 items-center justify-center">
                    <div className="col-span-1 flex w-full h-full items-center justify-center">
                        <SaveAsNewButton 
                            songTitle={songTitle}
                            updateSongTitle={(newTitle) => setSongTitle(newTitle)}
                            onSave={handleSaveAsNew}
                        />
                        <Button onClick={handleSave} disabled={user && song.id ? false : true} className="bg-gunmetal text-cultured border-none ml-4">
                            Save
                        </Button>
                    </div>
                    <div className="col-span-1 grid grid-cols-3 items-center justify-center">
                        {/* <div className="col-span-1 flex w-full h-full items-center justify-center">
                        
                        </div> */}
                        <div className="col-span-3 flex items-center justify-center">
                            <button onClick={handleClickPlay} className="mt-2 mx-2 bg-cultured text-black h-16 w-16 flex items-center justify-center rounded-full">
                                {performing ? <FaStop className="h-8 w-8" /> : <FaPlay className="ml-[5px] h-8 w-8"/>}
                            </button>
                        </div>
                        {/* <div className="col-span-1 flex w-full h-full items-center justify-center">
                            <Form>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Count-in"
                                />
                            </Form>
                        </div> */}
                    </div>
                    <div className="col-span-1 flex w-full h-full items-center justify-center">
                        {/* <UndoRedoButtons 
                            song={song}
                            updatePlaylist={(updatedPlaylist) => setPlaylist(updatedPlaylist)}
                            updateLayout={(updatedLayout) => setLayout(updatedLayout)}
                            updateTitle={(updatedTitle) => setSongTitle(updatedTitle)}
                        /> */}
                        <Button onClick={() => setPlaylist([])} className="bg-red-700 text-cultured border-none">
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
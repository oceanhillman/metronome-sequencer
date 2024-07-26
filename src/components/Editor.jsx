'use client'
import _ from 'lodash';
import { useEffect, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';

import Metronome from "@/components/Metronome";
import Playlist from "@/components/Playlist";
import SaveAsNewButton from "@/components/SaveAsNewButton";


import PlusIcon from "/public/plus.svg";

import { saveSong, addSong } from '@lib/api';

import { FaPlay, FaStop } from "react-icons/fa6";

const generatePatternId = () => String(Math.round(Date.now() + Math.random()));

export default function Editor(props) {
    const { songPayload } = props;
    const { user, error, isLoading } = useUser();
    const [history, setHistory] = useState([]);
    const [song, setSong] = useState({
        id: '',
        title: 'Untitled Song',
        playlist: [],
        layout: [],
        last_saved: '',
        created_at: '',
    });
    const [performing, setPerforming] = useState(false);
    const [currentSection, setCurrentSection] = useState();
    const [currentPattern, setCurrentPattern] = useState();
    const patternInitialized = useRef(false);
    
    // Preload any incoming song data
    useEffect(() => {
        if (songPayload) {
            setSong((prev => ({
                ...prev,
                id: songPayload.id,
                title: songPayload.title,
                layout: songPayload.layout,
                playlist: songPayload.playlist,
            })));
        } else {
            if (!patternInitialized.current) {
                console.log("trigger");
                initializeNewPattern();
                setHistory([]);
                patternInitialized.current = true;
            }
        }
    }, [])

    // Load unsaved project from local storage
    useEffect(() => {
        const unsavedProject = localStorage.getItem('unsavedProject');
        if (unsavedProject) {
            const unsavedProjectData = JSON.parse(unsavedProject);

            setSong((prev) => ({
                ...prev,
                title: unsavedProjectData.title,
                layout: unsavedProjectData.layout,
                playlit: unsavedProjectData.playlist,
            }))
        }
    }, []);

    useEffect(() => {
        console.log("Song:", song);
        console.log("History:", history)
    }, [song, history]);

    // Trigger metronome to play playlist
    function handleClickPlay() {
        if (song.playlist.length > 0) {
            setCurrentSection(song.playlist);
            setPerforming(!performing);
        }
    }

    // Add new pattern with default values
    function initializeNewPattern() {
        const patternId = generatePatternId();
        const newPattern = {
            id: patternId,
            name: `Pattern #${song.layout.length + 1}`,
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        const patternLayout = {
            i: patternId,
            x: 0,
            y: song.layout.length,
            h: 1,
            w: 1,
            isResizable: false,
        }
        setSong(prev => ({
            ...prev,
            playlist: [...prev.playlist, newPattern],
            layout: [...prev.layout, patternLayout],
        }));
    }

    const handleClickClonePattern = (pattern) => {
        const clonedPattern = {
            id: generatePatternId(),
            name: `${pattern.name} (clone)`,
            bpm: pattern.bpm,
            beatsPerMeasure: pattern.beatsPerMeasure,
            numMeasures: pattern.numMeasures,
        };
    
        const patternIndex = song.playlist.findIndex(pattern => pattern.id === pattern.id);
    
        if (patternIndex !== -1) {
            addToHistory(song);
            setSong(prev => ({
                ...prev,
                playlist: [
                    ...prev.playlist.slice(0, patternIndex + 1),
                    clonedPattern,
                    ...prev.playlist.slice(patternIndex + 1)
                ],
            }))
        } else {
            console.error('Pattern to clone not found');
        }
    };
    

    async function handleSave() {
        if (user && song.id) {
            await saveSong(song.id, user?.sub, song.title, song.playlist, song.layout);
        };
    }

    async function handleSaveAsNew() {
        if (user) {
            try {
                const id = await addSong(user?.sub, song.title, song.playlist, song.layout);
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
        const leadingPatternIndex = song.playlist.findIndex(pattern => pattern.id === patternId);
        setCurrentSection(song.playlist.slice(leadingPatternIndex));
        setPerforming(true);
    }

    const updatePattern = (id, attribute, value) => {
        setSong((prevSong) => ({
            ...prevSong,
            playlist: prevSong.playlist.map((pattern) =>
                pattern.id === id ? { ...pattern, [attribute]: value } : pattern
            ),
        }));
    };

    function addToHistory(songVersion) {
        const latestVersion = history[history.length - 1];
        if ((history.length === 0 || !_.isEqual(songVersion, latestVersion)) && (song.layout.length === song.playlist.length)) {
            console.log("Setting history: song version:", songVersion, "Latest history:", latestVersion);
            setHistory(prev => ([...prev, songVersion]));
        }
    }

    function undo() {
        if (history.length > 0) {
            const previousState = history[history.length - 1];
            setSong(previousState);
            setHistory(history.slice(0, -1));
        }
    }

    function handleClickNewPattern() {
        addToHistory(song);
        initializeNewPattern();
    }

    function handleClickClear() {
        addToHistory(song);
        setSong(prev => ({
            ...prev,
            playlist: [],
            layout: [],
        }));
    }

    function handleClickDeletePattern(id) {
        addToHistory(song);
        setSong(prev => ({
            ...prev,
            playlist: prev.playlist.filter(item => item.id !== id),
        }));
    }

    useEffect(() => {
        console.log("Layout", song.layout);
    }, [song.layout]);
    
    function handleEditTitle(value) {
        addToHistory(song);
        setSong(prev => ({
            ...prev,
            title: value,
        }));
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
                                value={song.title}
                                onChange={(e) => handleEditTitle(e.target.value)}
                                placeholder={"Song Title"}
                            />
                            <Playlist 
                                addToHistory={addToHistory}
                                song={song}
                                playlistData={song.playlist}
                                handleUpdatePlaylist={(newPlaylist) => setSong(prev => ({...prev, playlist: newPlaylist}))}
                                handleClone={(pattern) => handleClickClonePattern(pattern)}
                                currentPatternId={currentPattern}
                                handleUpdateLayout={(newLayout) => setSong(prev => ({...prev, layout: newLayout}))}
                                handleUpdatePattern={updatePattern}
                                handleClickDelete={(id) => handleClickDeletePattern(id)}
                                performing={performing}
                                startFromPattern={handleStartFromPattern}
                            />
                        </div>
                        <button onClick={handleClickNewPattern} className="mt-2 bg-muted-blue hover:bg-arsenic border-2 border-arsenic p-3 rounded-full">
                            <Image src={PlusIcon} alt="Plus icon" className="w-auto h-auto"/>
                        </button>
                    </div>     
                </div>
            </div>

            <div className="sticky bottom-0 bg-eerie-black border-t-2 border-arsenic text-cultured py-4">
                <div className="grid grid-cols-3 items-center justify-center">
                    <div className="col-span-1 flex w-full h-full items-center justify-center">
                        <SaveAsNewButton 
                            songTitle={song.title}
                            updateSongTitle={(newTitle) => setSong(prev => ({...prev, title: newTitle}))}
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
                        <Button onClick={undo} disabled={history.length === 0} variant="primary" className="text-cultured border-none">
                            Undo
                        </Button>
                        <Button onClick={handleClickClear} className="bg-red-700 text-cultured border-none">
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
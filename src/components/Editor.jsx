'use client'
import _ from 'lodash';
import { useEffect, useState, useRef } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';

import Metronome from "@/components/Metronome";
import Playlist from "@/components/Playlist";
import SaveAsNewButton from "@/components/SaveAsNewButton";


import PlusIcon from "/public/plus.svg";

import { saveSong, addSong } from '@lib/api';

import { FaPlay, FaStop } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";

const generatePatternId = () => String(Math.round(Date.now() + Math.random()));

export default function Editor(props) {
    const { songPayload } = props;
    const { user, error, isLoading } = useUser();
    const [undoHistory, setUndoHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
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
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const patternInitialized = useRef(false);
    const bottomRef = useRef(null);
    
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
                setUndoHistory([]);
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
        console.log("History:", undoHistory)
    }, [song, undoHistory]);

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
        return patternId;
    }

    const handleClickClonePattern = (originalPattern) => {
        const clonedPattern = {
            id: generatePatternId(),
            name: `${originalPattern.name} (clone)`,
            bpm: originalPattern.bpm,
            beatsPerMeasure: originalPattern.beatsPerMeasure,
            numMeasures: originalPattern.numMeasures,
        };
    
        const patternIndex = song.playlist.findIndex(pattern => pattern.id === originalPattern.id);
    
        if (patternIndex !== -1) {
            addToUndoHistory(song);
            setSong(prev => ({
                ...prev,
                playlist: [
                    ...prev.playlist.slice(0, patternIndex + 1),
                    clonedPattern,
                    ...prev.playlist.slice(patternIndex + 1)
                ],
            }));
            setTimeout(() => {
                const newPatternElement = document.getElementById(clonedPattern.id);
                newPatternElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
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

    function addToRedoHistory(songVersion) {
        setRedoHistory(prev => [...prev, songVersion]);
    }

    function addToUndoHistory(songVersion) {
        const latestVersion = undoHistory[undoHistory.length - 1];
        if ((history.length === 0 || !_.isEqual(songVersion, latestVersion)) && (song.layout.length === song.playlist.length)) {
            console.log("Setting history: song version:", songVersion, "Latest history:", latestVersion);
            setUndoHistory(prev => ([...prev, songVersion]));
            setRedoHistory([]);
        }
    }

    function redo() {
        if (redoHistory.length > 0) {
            const nextState = redoHistory[redoHistory.length - 1];
            addToUndoHistory(song);
            setSong(nextState);
            setRedoHistory(redoHistory.slice(0, -1));
        }
    }

    function undo() {
        if (undoHistory.length > 0) {
            const previousState = undoHistory[undoHistory.length - 1];
            addToRedoHistory(song);
            setSong(previousState);
            setUndoHistory(undoHistory.slice(0, -1));
        }
    }

    function handleClickNewPattern() {
        addToUndoHistory(song);
        const newPatternId = initializeNewPattern();
        setTimeout(() => {
            const newPatternElement = document.getElementById(newPatternId);
            newPatternElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
    }

    function handleClickClear() {
        addToUndoHistory(song);
        setSong(prev => ({
            ...prev,
            playlist: [],
            layout: [],
        }));
    }

    function handleClickDeletePattern(id) {
        
        

        setTimeout(() => {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 0);
        
        addToUndoHistory(song);
        setSong(prev => ({
            ...prev,
            playlist: prev.playlist.filter(item => item.id !== id),
        }));
    }

    useEffect(() => {
        console.log("Layout", song.layout);
    }, [song.layout]);
    
    function handleEditTitle(value) {
        addToUndoHistory(song);
        setSong(prev => ({
            ...prev,
            title: value,
        }));
    }

    function toggleDropdown(isOpen) {
        setDropdownIsOpen(isOpen);
    }


    return (
    <div className="flex flex-col min-h-screen w-full">
        <div className="flex-grow pt-6 lg:pt-12 d-flex flex-col pb-16">
            <div className="w-full h-full d-flex flex-col">
                <Metronome
                    playlist={currentSection}
                    performing={performing}
                    onPlaylistEnd={() => setPerforming(false)}
                    onNextPattern={(patternId) => setCurrentPattern(patternId)}
                />
                <div className="flex flex-col justify-center mt-4 lg:mt-8">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col w-[100%] lg:w-[65%] xl:w-1/2 justify-center">
                            <div className="flex flex-col">
                                <input className="w-full self-center border-2 bg-black border-1 border-muted-blue text-cultured  text-lg rounded-md text-center
                                focus:bg-eerie-black focus:text-cultured focus:border-arsenic focus:ring-2 focus:ring-muted-blue focus:outline-none"
                                    type="text"
                                    value={song.title}
                                    onChange={(e) => handleEditTitle(e.target.value)}
                                    placeholder={"Song Title"}
                                    disabled={performing}
                                />
                            </div>

                            <Playlist 
                                addToHistory={addToUndoHistory}
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
                        {!performing ? 
                        <button onClick={handleClickNewPattern} className="mt-2 bg-muted-blue hover:bg-arsenic border-2 border-arsenic p-3 rounded-full">
                            <Image src={PlusIcon} alt="Plus icon" draggable={false} className="w-auto h-auto"/>
                        </button> : null}
                    </div>     
                </div>
            </div>
        </div>

        <div ref={bottomRef} className="sticky bottom-0 bg-eerie-black border-t-2 border-arsenic text-cultured py-4">
            <div className="flex flex-row items-center justify-center w-full">
                <div className="flex w-full h-full items-center justify-center">
                    <Dropdown
                        show={dropdownIsOpen}
                        onToggle={toggleDropdown}
                    >
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className="d-flex items-center justify-center">
                            <IoIosSave />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="flex flex-col">
                            <Dropdown.Item disabled={user && song.id ? false : true}>
                                <button onClick={handleSave} className="disabled:text-gray-400">
                                    Save
                                </button>
                            </Dropdown.Item>

                            <Dropdown.Item>
                                <SaveAsNewButton 
                                    songTitle={song.title}
                                    updateSongTitle={(newTitle) => setSong(prev => ({...prev, title: newTitle}))}
                                    onSave={handleSaveAsNew}
                                />
                            </Dropdown.Item>                                
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-row w-full h-full items-center justify-center">
                        <button onClick={undo} disabled={undoHistory.length === 0} className="text-cultured disabled:text-arsenic text-xl">
                            Undo
                        </button>
                    </div>
                    <div className="flex items-center justify-center mx-4">
                        <button onClick={handleClickPlay} className="mt-2 mx-2 bg-cultured text-black h-16 w-16 flex items-center justify-center rounded-full">
                            {performing ? <FaStop className="h-8 w-8" /> : <FaPlay className="ml-[5px] h-8 w-8"/>}
                        </button>
                    </div>
                    <div className="flex w-full h-full items-center justify-center">
                        <button onClick={redo} disabled={redoHistory.length === 0} className="text-cultured disabled:text-arsenic text-xl">
                            Redo
                        </button>
                    </div>
                </div>
                <div className="col-span-1 flex w-full h-full items-center justify-center">
                    <Button onClick={handleClickClear} variant="danger" className="text-cultured border-none">
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    </div>

    )
}
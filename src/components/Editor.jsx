'use client'
import _ from 'lodash';
import { useEffect, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';

import Metronome from "@/components/Metronome";
import Playlist from "@/components/Playlist";
import SaveAsNewButton from "@/components/SaveAsNewButton";
import UndoRedoButtons from "@/components/UndoRedoButtons";

import PlusIcon from "/public/plus.svg";

import { saveSong, addSong } from '@lib/api';
import { useWarnOnUnsavedChanges } from '@lib/utils';

import { FaPlay, FaStop } from "react-icons/fa6";

const generatePatternId = () => String(Math.round(Date.now() + Math.random()));
//                                                                                  TO DO: now that I understand how gridLayout works in Playlist.jsx, strip 'layout' from Editor.jsx
//                                                                                      so that it is not a separate entity from song.layout
//                                                                                  Then, continue debugging the infinite loop when loading an existing song.
export default function Editor(props) {
    const { songPayload } = props;
    const { user, error, isLoading } = useUser();
    const [song, setSong] = useState({
        id: '',
        title: 'Untitled Song',
        playlist: [{
            id: generatePatternId(),
            name: 'Pattern #1',
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        }],
        layout: [{
            i: generatePatternId(),
            x: 0,
            y: 0,
            w: 1,
            h: 1,
        }],
    });
    const [performing, setPerforming] = useState(false);
    const [currentSection, setCurrentSection] = useState();
    const [currentPattern, setCurrentPattern] = useState();
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const [history, setHistory] = useState([]);

    useWarnOnUnsavedChanges(unsavedChanges);

    useEffect(() => {
        if (history.length === 0) {
            setUnsavedChanges(false);
        } else if (user) {
            setUnsavedChanges(true);
        }
    }, [history, user]);

    // Update history when:
    // layout and playlist are in sync AND
    // history is out of date AND
    // song.prev != song
    // Update prevSongRef with the previous song state before updating


    useEffect(() => {
        if (songPayload) {
            setSong((prev => ({
                ...prev,
                id: songPayload.id,
                title: songPayload.title,
                playlist: songPayload.playlist || [],
                layout: songPayload.layout
            })));
        }
        setHistory([]);
    }, [songPayload]);





    const undo = () => {

    };

    useEffect(() => {
        console.log("History:", history);
        console.log("song:", song);
    }, [history, song]);
    
    // Preload any incoming song data
   

    // Load unsaved project from local storage
    useEffect(() => {
        const unsavedChanges = localStorage.getItem('unsavedChanges');
        if (unsavedChanges) {
            setUnsavedChanges(true);
            const unsavedChangesData = JSON.parse(unsavedChanges);

            setSong((prev => ({
                ...prev,
                title: unsavedChangesData.title,
                playlist: unsavedChangesData.playlist || [],
                layout: unsavedChangesData.layout
            })));
        }
    }, []);

    // Trigger metronome to play playlist
    function handleClickPlay() {
        const currentPlaylist = song.playlist;
        if (currentPlaylist.length > 0) {
            setCurrentSection(currentPlaylist);
            setPerforming(!performing);
        }
    }

    // Add new pattern with default values
    function initializeNewPattern() {
        const currentPlaylist = song.playlist;
        const patternId = generatePatternId();
        const newPattern = {
            id: patternId,
            name: `Pattern #${currentPlaylist.length + 1}`,
            bpm: 120,
            beatsPerMeasure: 4,
            numMeasures: 4,
        };
        const patternLayout = {
            i: patternId,
            x: 0,
            y: currentPlaylist.length,
            w: 1,
            h: 1,
        }
        setSong(prevSong => ({
            ...prevSong,
            playlist: [...prevSong.playlist, newPattern],
            layout: [...prevSong.layout, patternLayout],
        }));
    }

    const clonePattern = (patternData) => {
        const clonedPattern = {
            id: generatePatternId(),
            name: `${patternData.name} (clone)`,
            bpm: patternData.bpm,
            beatsPerMeasure: patternData.beatsPerMeasure,
            numMeasures: patternData.numMeasures,
        };
    
        const patternIndex = song.playlist.findIndex(pattern => pattern.id === patternData.id);
    
        if (patternIndex !== -1) {
            setSong(prevSong => ({
                ...prevSong,
                playlist: [
                    ...prevSong.playlist.slice(0, patternIndex + 1),
                    clonedPattern,
                    ...prevSong.playlist.slice(patternIndex + 1)
                ]
            }));
        } else {
            console.error('Pattern to clone not found');
        }
    };
    
    async function handleSave() {
        const currentSong = song;
        if (user && currentSong.id) {
            await saveSong(currentSong.id, user?.sub, currentSong.title, currentSong.playlist, currentSong.layout);
        };
    }

    async function handleSaveAsNew() {
        if (user) {
            try {
                const id = await addSong(user?.sub, song.title, song.playlist, song.layout);
                localStorage.removeItem('unsavedChanges');
                window.location.href = `/song/${id}`;
            } catch (error) {
                console.error("Error adding song:", error.message);
            }
        } else {
            localStorage.setItem('unsavedChanges', JSON.stringify(song));
            window.location.href = '/api/auth/login';
        }
    }

    function handleStartFromPattern(patternId) {
        const leadingPatternIndex = song.playlist.findIndex(pattern => pattern.id === patternId);
        setCurrentSection(song.playlist.slice(leadingPatternIndex));
        setPerforming(true);
    }

   function updatePlaylist(playlist) {
    setSong(prev => ({
        ...prev,
        playlist: playlist
    }));
   }

   function updateLayout(layout) {
    setSong(prev => ({
        ...prev,
        layout: layout
    }));
   }

   function updateTitle(title) {
    setSong(prev => ({
        ...prev,
        title: title
    }));
   }

    function clearPlaylist() {
        setSong(prevSong => ({
            ...prevSong,
            playlist: []
        }));
    }

    function deletePattern(id) {
        updatePlaylist((prevItems) => prevItems.filter(item => item.id !== id));
    }

    const updatePattern = (id, attribute, value) => {
        setSong((prevSong) => ({
            ...prevSong,
            playlist: prevSong.playlist.map((pattern) =>
                pattern.id === id ? { ...pattern, [attribute]: value } : pattern
            ),
        }));
    };
    
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
                                onChange={(e) => updateTitle(e.target.value)}
                                placeholder={"Song Title"}
                            />
                            <Playlist 
                                song={song || {playlist: []}}
                                handleUpdateLayout={updateLayout}
                                handleUpdatePlaylist={updatePlaylist}
                                handleUpdatePattern={updatePattern}
                                handleClickDelete={deletePattern}
                                handleClickClone={clonePattern}
                                currentPatternId={currentPattern}
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
                            songTitle={song.title}
                            updateSongTitle={(newTitle) => updateTitle(newTitle)}
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
                        <UndoRedoButtons 
                            song={song}
                            history={history}
                            undo={undo}
                        />
                        <Button onClick={clearPlaylist} className="bg-red-700 text-cultured border-none">
                            Start Over
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import React, { forwardRef, useState, useEffect, useRef } from "react"
import Image from "next/image"
import NumberInput from "@/components/NumberInput"
import DragHandleIcon from "/public/drag_handle.svg"
import DeleteIcon from "/public/delete.svg"
import CloneIcon from "/public/clone.svg"
import { FaPlay } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { current } from "tailwindcss/colors"

const Pattern = forwardRef((props, ref) => {
    const { dataGrid, song, addToHistory, patternData, handleUpdatePattern, handleClone, handleClickDelete, currentPatternId, performing, startFromPattern, metronomeIsPlaying } = props;

    const [inputData, setInputData] = useState({
        name: patternData.name,
        beatsPerMeasure: patternData.beatsPerMeasure,
        bpm: patternData.bpm,
        numMeasures: patternData.numMeasures,
    });
    const [isCurrentPattern, setIsCurrentPattern] = useState(false);
    const [duration, setDuration] = useState(0);
    const [fractionElapsed, setFractionElapsed] = useState(0);
    const [durationText, setDurationText] = useState("00:00");
    const patternRef = useRef(null);

    const startRef = useRef();
    const shouldUpdateRef = useRef(false); // Ref to track if updates should continue

    useEffect(() => {
        if (currentPatternId === patternData.id) {
            setIsCurrentPattern(true);
        } else {
            setIsCurrentPattern(false);
        }
    }, [currentPatternId])

    useEffect(() => {
        const newDuration = getDurationText(patternData.numMeasures, patternData.beatsPerMeasure, patternData.bpm);
        setDurationText(newDuration);
        setInputData(patternData);
    }, [patternData])
    
    useEffect(() => {
        if (isCurrentPattern) {
            patternRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isCurrentPattern]);

    useEffect(() => {
        if (isCurrentPattern) {
            startRef.current = Date.now();
        }
    }, [isCurrentPattern]);

    useEffect(() => {
        setDuration(calculateDuration(inputData.numMeasures, inputData.beatsPerMeasure, inputData.bpm));
    }, [inputData.bpm, inputData.beatsPerMeasure, inputData.numMeasures]);

    useEffect(() => {
        // Set the start time when the pattern starts
        startRef.current = Date.now();

        if (isCurrentPattern && performing) {
        shouldUpdateRef.current = true; // Allow updates

        const updateProgress = () => {
            if (!shouldUpdateRef.current) return; // Exit if updates should not continue

            const elapsed = (Date.now() - startRef.current) / 1000; // Time in seconds
            const newFraction = Math.min(1, elapsed / duration);
            setFractionElapsed(newFraction);

            // Continue updating if the total duration has not been reached and performing is true
            if (newFraction < 1) {
            requestAnimationFrame(updateProgress);
            }
        };

        // Start the animation
        requestAnimationFrame(updateProgress);
        }

        // Cleanup function to stop animation
        return () => {
        shouldUpdateRef.current = false; // Stop updates
        setFractionElapsed(0);
        };
    }, [isCurrentPattern, performing, duration]);

    const calculateDuration = (numMeasures, beatsPerMeasure, bpm) => {
        const totalBeats = numMeasures * beatsPerMeasure;
        const secondsPerBeat = 60 / bpm;
        const totalSeconds = totalBeats * secondsPerBeat;
        return totalSeconds;
    };

    const getDurationText = (numMeasures, beatsPerMeasure, bpm) => {
        const totalBeats = numMeasures * beatsPerMeasure;
        const secondsPerBeat = 60 / bpm;
        const totalSeconds = totalBeats * secondsPerBeat;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    function validateNumber(value, min, max) {
        if (value <= min) {
            return min;
        } else if (value >= max) {
            return max;
        } else {
            return value;
        }
    }

    function handleUpdateNumber(attribute, value, min, max) {
        const validatedNumber = validateNumber(value, min, max);
        setInputData((prev) => ({
            ...prev,
            [attribute]: validatedNumber,
        }));
        handleUpdatePattern(patternData.id, attribute, validatedNumber);
    }

    function handleUpdateName(newTitle) {
        setInputData((prev) => ({
            ...prev,
            name: newTitle,
        }));
    }

    function handleBlur(attribute, value, min, max) {
        if (value !== '') {
            const validatedNumber = validateNumber(value, min, max);

            if (patternData[attribute] !== value && value >= min && value <= max) {
                addToHistory(song);
                handleUpdateNumber(attribute, value, min, max);
            } else {
                handleUpdateNumber(attribute, validatedNumber, min, max);
            }
        } else if (patternData[attribute] !== min) {
            addToHistory(song);
            handleUpdateNumber(attribute, min, min, max);
        }
    }

    function handleBlurName(newTitle) {
        if (patternData.name !== newTitle) {
            addToHistory(song);
            handleUpdatePattern(patternData.id, 'name', newTitle);
        }
    }

    function handleClickPlay() {
        startFromPattern(patternData.id);
    }

    function handleClickClone() {
        handleClone(patternData);
    }

    function updateInputValue(attribute, value) {
        setInputData((prev) => ({
            ...prev,
            [attribute]: value
        }));
    }

    function Buttons() {
        if (!performing) {
            return (
                <div className="col-span-1 flex h-[24px] items-center space-x-1 ml-auto mr-2">
                    <button onClick={handleClickPlay} disabled={metronomeIsPlaying} className="w-[20px] h-[20px]">
                        <IconContext.Provider value={{ color: metronomeIsPlaying ? "gray" : "green", }}>
                            <FaPlay />
                        </IconContext.Provider>
                    </button>
                    <button onClick={handleClickClone} className="w-[20px] h-[20px]">
                        <Image src={CloneIcon} alt="Clone icon" className="w-auto h-auto"/>
                    </button>
                    <button onClick={() => handleClickDelete(patternData.id)} className="w-[20px] h-[20px]">
                        <Image src={DeleteIcon} alt="Delete icon" className="w-auto h-auto"/>
                    </button>
                </div>
            );
        } else {
            return <div className="ml-auto"></div>;
        }
    }

    return (
        <div ref={patternRef} data-grid={{ ...dataGrid, isResizable: false }} key={ref} id={patternData.id}
        className={`flex flex-row rounded-md h-full w-full content-between justify-center 
            ${isCurrentPattern ? "bg-arsenic" : "bg-muted-blue"} text-black`}>
            
            <div className="grid grid-cols-3 md:grid-cols-5 w-full">
                <div className="col-span-1 mx-2">
                    <input
                        className="bg-inherit text-cultured  text-sm mt-[2px] self-start mr-auto w-full rounded-sm
                        focus:bg-subtle-gray focus:text-cultured focus:border-arsenic focus:ring-2 focus:ring-arsenic focus:outline-none"
                        type="text"
                        placeholder="Pattern Name"
                        value={inputData.name}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        disabled={performing}
                        onChange={(e) => handleUpdateName(e.target.value)}
                        onBlur={(e) => handleBlurName(e.target.value)}                        
                    />
                </div>
                <div className={` ${performing ? "" : "handle cursor-move" } col-span-1 md:col-span-3 flex flex-row w-full h-[24px] border-x-2 border-dark-gunmetal justify-center`}>
                    <Image src={DragHandleIcon} alt="Drag handle icon" className={`${performing ? "hidden" : ""} w-auto h-auto`} />
                </div>
                <div className="col-span-1 flex justify-between mx-2">
                    <p className="mt-[2px] text-gray-400 text-sm ">{durationText}</p>
                    <Buttons />
                </div>
            </div>

            <div className={`no-drag cursor-auto absolute w-full h-[80%] rounded-b-md bottom-0 
                ${isCurrentPattern ? "bg-subtle-gray" : "bg-eerie-black"}`}>
                {isCurrentPattern && performing ? 
                <div 
                    className="absolute w-full h-full bg-white/[0.03] border-r border-white"
                    style={{ width: `${fractionElapsed * 100}%` }}>
                </div> : null}
                <div className="flex flex-row justify-center text-xl text-cultured">
                    <div className="flex flex-col justify-center items-center py-2">
                        <p className="m-0">BPM</p>
                        <NumberInput
                            name="bpm"
                            key="bpm"
                            value={inputData.bpm}
                            min={1}
                            max={300}
                            onChange={(e) => handleUpdateNumber('bpm', Number(e.target.value), 1, 300)}
                            onBlur={(value) => handleBlur('bpm', value, 1, 300)}
                            disabled={performing}
                            currentPattern={isCurrentPattern}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center px-2 lg:px-4">
                        <p className="m-0">Beats</p>
                        <NumberInput
                            name="beatsPerMeasure"
                            key="beatsPerMeasure"
                            value={inputData.beatsPerMeasure}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdateNumber('beatsPerMeasure', Number(e.target.value))}
                            onBlur={(value) => handleBlur('beatsPerMeasure', value, 1, 64)}
                            disabled={performing}
                            currentPattern={isCurrentPattern}
                            updateInputValue={updateInputValue}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="m-0">Measures</p>
                        <NumberInput
                            name="numMeasures"
                            key="numMeasures"
                            value={inputData.numMeasures}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdateNumber('numMeasures', Number(e.target.value))}
                            onBlur={(value) => handleBlur('numMeasures', value, 1, 64)}
                            disabled={performing}
                            currentPattern={isCurrentPattern}
                            updateInputValue={updateInputValue}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Pattern;

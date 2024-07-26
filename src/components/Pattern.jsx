'use client'
import React, { forwardRef, useState, useEffect, useRef } from "react"
import Image from "next/image"
import NumberInput from "@/components/NumberInput"
import DragHandleIcon from "/public/drag_handle.svg"
import DeleteIcon from "/public/delete.svg"
import CloneIcon from "/public/clone.svg"
import { FaPlay } from "react-icons/fa6";
import { IconContext } from "react-icons";

const Pattern = forwardRef((props, ref) => {
    const { dataGrid, song, addToHistory, patternData, handleUpdatePattern, handleClone, handleClickDelete, currentPatternId, performing, startFromPattern } = props;

    const initialData = patternData || {
        name: "",
        beatsPerMeasure: 4,
        bpm: 120,
        numMeasures: 4,
        duration: "00:00",
        id: ""
    };
    const [duration, setDuration] = useState(initialData.duration);

    const calculateDuration = (numMeasures, beatsPerMeasure, bpm) => {
        const totalBeats = numMeasures * beatsPerMeasure;
        const secondsPerBeat = 60 / bpm;
        const totalSeconds = totalBeats * secondsPerBeat;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const [inputData, setInputData] = useState({
        name: patternData.name,
        beatsPerMeasure: patternData.beatsPerMeasure,
        bpm: patternData.bpm,
        numMeasures: patternData.numMeasures,
    });

    useEffect(() => {
        const newDuration = calculateDuration(patternData.numMeasures, patternData.beatsPerMeasure, patternData.bpm);
        setDuration(newDuration);

        setInputData(patternData);
    }, [patternData])

    const patternRef = useRef(null);

    useEffect(() => {
        // Check if the current pattern ID matches the pattern's ID
        if (currentPatternId === patternData.id) {
            // Scroll into view when the component mounts or currentPatternId changes
            patternRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentPatternId, patternData.id]);

    function handleUpdate(attribute, value) {
        setInputData((prev) => ({
            ...prev,
            [attribute]: value,
        }));
        addToHistory(song);
        handleUpdatePattern(patternData.id, attribute, value);
    }

    function handleClickPlay() {
        startFromPattern(patternData.id);
    }

    function Buttons() {
        if (!performing) {
            return (
                <div className="col-span-1 flex h-[24px] items-center space-x-1 ml-auto mr-2">
                    <button onClick={handleClickPlay} className="w-[20px] h-[20px]">
                        <IconContext.Provider value={{ color: 'green', }}>
                            <FaPlay />
                        </IconContext.Provider>
                    </button>
                    <button onClick={() => handleClone(patternData)} className="w-[20px] h-[20px]">
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
        <div ref={patternRef} data-grid={{ ...dataGrid, isResizable: false }} key={ref} className={`flex flex-row rounded-md h-full w-full content-between justify-center 
            ${currentPatternId === patternData?.id ? "bg-arsenic" : "bg-muted-blue"} text-black`}>

            <div className="grid grid-cols-3 md:grid-cols-5 w-full">
                <div className="col-span-1 ml-2">
                    <input
                        className="bg-inherit text-cultured font-poppins text-sm mt-[2px] self-start mr-auto w-full"
                        type="text"
                        placeholder="Pattern Name"
                        value={inputData.name}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onChange={(e) => handleUpdate('name', e.target.value)}
                    />
                </div>
                <div className="handle col-span-1 md:col-span-3 flex flex-row w-full h-[24px] border-x-2 border-dark-gunmetal cursor-move justify-center">
                    <Image src={DragHandleIcon} alt="Drag handle icon" className="w-auto h-auto" />
                </div>
                <div className="col-span-1 flex justify-between mx-2">
                    <p className="mt-[2px] text-gray-400 text-sm font-sans">{duration}</p>
                    <Buttons />
                </div>
            </div>

            <div className={`no-drag cursor-auto absolute w-full h-[80%] rounded-b-md bottom-0 
                ${currentPatternId === patternData?.id ? "bg-subtle-gray" : "bg-eerie-black"}`}>

                <div className="grid grid-cols-3 grid-rows-2 font-sans text-xl text-cultured">
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2 py-2">
                        <p>BPM</p>
                        <NumberInput
                            name="bpm"
                            value={inputData.bpm}
                            min={1}
                            max={300}
                            onChange={(e) => handleUpdate('bpm', Number(e.target.value))}
                            disabled={performing}
                            currentPattern={currentPatternId === patternData?.id}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2">
                        <p>Beats</p>
                        <NumberInput
                            name="beatsPerMeasure"
                            value={inputData.beatsPerMeasure}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdate('beatsPerMeasure', Number(e.target.value))}
                            disabled={performing}
                            currentPattern={currentPatternId === patternData?.id}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2">
                        <p>Measures</p>
                        <NumberInput
                            name="numMeasures"
                            value={inputData.numMeasures}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdate('numMeasures', Number(e.target.value))}
                            disabled={performing}
                            currentPattern={currentPatternId === patternData?.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Pattern;

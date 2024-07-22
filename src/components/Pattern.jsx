'use client'
import React, { forwardRef, useState, useEffect } from "react"
import Image from "next/image"
import NumberInput from "@/components/NumberInput"
import DragHandleIcon from "/public/drag_handle.svg"
import DeleteIcon from "/public/delete.svg"
import CloneIcon from "/public/clone.svg"
import { FaP, FaPlay } from "react-icons/fa6";


const Pattern = forwardRef((props, ref) => {
    const { dataGrid, patternData, handleUpdatePattern, handleClickClone, handleClickDelete, currentPatternId, performing, startFromPattern } = props;

    const [inputData, setInputData] = useState({
            name: patternData.name,
            beatsPerMeasure: patternData.beatsPerMeasure,
            bpm: patternData.bpm,
            numMeasures: patternData.numMeasures,
        });

    function handleUpdate(attribute, value) {
        setInputData((prev) => ({
            ...prev,
            [attribute]: value,
        }));
        handleUpdatePattern(patternData.id, attribute, value);
    }

    function handleClickPlay(event) {
        event.stopPropagation();
        startFromPattern(patternData.id)
    }

    function Buttons() {
        if (!performing) {
            return (
                <div className="flex h-[24px] items-center space-x-1 ml-auto mr-2">
                    <button onMouseDown={(event) => handleClickPlay(event)} className="w-[20px] h-[20px]">
                        <FaPlay />
                    </button>
                    <button onMouseDown={(event) => handleClickClone(event, patternData)} className="w-[20px] h-[20px]">
                        <Image src={CloneIcon} alt="Clone icon" className="w-auto h-auto"/>
                    </button>
                    <button onMouseDown={(event) => handleClickDelete(event, patternData.id)} className="w-[20px] h-[20px]">
                        <Image src={DeleteIcon} alt="Delete icon" className="w-auto h-auto"/>
                    </button>
                </div>
            );
        } else {
            return (
                <div clasName="ml-auto"></div>
            );
        }
    }
    

    return (
        <div data-grid={{...dataGrid, isResizable: false}} key={ref} className={`handle cursor-move flex flex-row rounded-md h-full w-full content-between justify-center 
            ${currentPatternId === patternData.id ? "bg-arsenic" : "bg-muted-blue"} text-black`}>

            <input 
                className="bg-inherit ml-2 text-cultured font-sans text-sm mt-[2px] self-start mr-auto"
                type="text"
                placeholder="Pattern Name"
                value={inputData.name}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => handleUpdate('name', e.target.value)}
            />
            <Image src={DragHandleIcon} alt="Drag handle icon" className="absolute w-auto h-auto"/>

            <Buttons />

            <div className={`no-drag cursor-auto absolute w-full h-[80%] rounded-b-md bottom-0 
            ${currentPatternId === patternData.id ? "bg-subtle-gray" : "bg-eerie-black"}`}>
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
                            currentPattern={currentPatternId === patternData.id ? true : false}
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
                            currentPattern={currentPatternId === patternData.id ? true : false}
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
                            currentPattern={currentPatternId === patternData.id ? true : false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Pattern;

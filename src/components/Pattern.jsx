import React, { forwardRef, useState, useEffect } from "react"
import Image from "next/image"
import NumberInput from "@/components/NumberInput"
import DragHandleIcon from "/public/drag_handle.svg"
import DeleteIcon from "/public/delete.svg"
import CloneIcon from "/public/clone.svg"

const Pattern = forwardRef((props, ref) => {
    const { dataGrid, patternData, handleUpdatePattern, handleClickClone, handleClickDelete } = props;

    const [inputData, setInputData] = useState({
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

    return (
        <div data-grid={{...dataGrid, isResizable: false}} key={ref} className="handle cursor-move flex flex-row rounded-md h-[100px] w-full content-between justify-center items-start bg-blue-500 text-black">
            <Image src={DragHandleIcon} alt="Drag handle icon" className="absolute w-auto h-auto"/>
            <div className="flex h-[24px] items-center space-x-1 ml-auto mr-2">
                <button onMouseDown={(event) => handleClickClone(event, patternData)} className="w-[20px] h-[20px]">
                    <Image src={CloneIcon} alt="Clone icon" className="w-auto h-auto"/>
                </button>
                <button onMouseDown={(event) => handleClickDelete(event, patternData.id)} className="w-[20px] h-[20px]">
                    <Image src={DeleteIcon} alt="Delete icon" className="w-auto h-auto"/>
                </button>
            </div>

            <div className="no-drag cursor-auto absolute w-full h-[75%] rounded-b-md bottom-0 bg-gray-900">
                <div className="grid grid-cols-3 grid-rows-2 font-roboto text-xl text-white">
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2">
                        <p>BPM</p>
                        <NumberInput
                            value={inputData.bpm}
                            min={1}
                            max={300}
                            onChange={(e) => handleUpdate('bpm', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2">
                        <p>Beats</p>
                        <NumberInput
                            value={inputData.beatsPerMeasure}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdate('beatsPerMeasure', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center col-span-1 row-span-2">
                        <p>Measures</p>
                        <NumberInput
                            value={inputData.numMeasures}
                            min={1}
                            max={64}
                            onChange={(e) => handleUpdate('numMeasures', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Pattern;

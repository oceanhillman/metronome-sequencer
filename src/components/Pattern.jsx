import React, { forwardRef, useState } from 'react';

const Pattern = forwardRef((props, ref) => {
    const { dataGrid, patternData, handleUpdatePattern, handleClickDelete } = props;

    const [inputData, setInputData] = useState(
        {
            beatsPerMeasure: patternData.beatsPerMeasure,
            bpm: patternData.bpm,
            numMeasures: patternData.numMeasures,
        });

    function handleUpdate(attribute, value) {
        setInputData((prev) => ({
            ...prev,
            [attribute]: value,
        }));
        handleUpdatePattern(patternData.id, attribute, value)
    }

    return (
        <div data-grid={{...dataGrid, isResizable: false}} key={ref} className="flex flex-row rounded-md h-[100px] w-full content-between justify-end bg-red-800 text-black font-roboto">
        <p>Clone</p><p>Delete</p>
            <div className="absolute w-full h-[75%] rounded-b-md bottom-0 bg-white/70">
                <div className="flex">
                    <div className="w-1/4">
                        Beats per measure <input className="w-12" type="number" value={inputData.beatsPerMeasure} onChange={(e) => handleUpdate('beatsPerMeasure', Number(e.target.value))} />
                    </div>
                    <div className="w-1/4">
                        BPM: <input className="w-12" type="number" value={inputData.bpm} onChange={(e) => handleUpdate('bpm', Number(e.target.value))} />
                    </div>
                    <div className="w-1/4">
                        x<input className="w-12" type="number" value={inputData.numMeasures} onChange={(e) => handleUpdate('numMeasures', Number(e.target.value))} /> Measures
                    </div>
                    <div className="w-1/4">
                        <button onMouseDown={(event) => handleClickDelete(event, patternData.id)} className="bg-slate-700 text-white text-sm px-1 py-1 rounded">
                            x
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Pattern;

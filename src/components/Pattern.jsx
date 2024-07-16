import React, { forwardRef } from 'react';

const Pattern = forwardRef((props, ref) => {
    const { id, dataGrid, bpm, timeSignature, numMeasures } = props;

    return (
        <div data-grid={dataGrid} key={ref} className="grid grid-cols-12 grid-rows-2 rounded-xl w-full bg-red-100 border-2 border-black text-black">
            <div className="col-span-1 row-span-2">
                <div className="font-roboto font-bold justify-center items-center flex">
                    <input className="w-full text-center" type="number" value={timeSignature[0]} onChange={() => {}} />
                </div>
                <div className="font-roboto font-bold justify-center items-center flex">
                    <input className="w-full text-center" type="number" value={timeSignature[1]} onChange={() => {}} />
                </div>
            </div>
            <div className="col-span-11 row-span-2 flex">
                <div className="w-1/2">a</div>
                <div className="w-1/2">b</div>
            </div>
        </div>
    );
});

export default Pattern;

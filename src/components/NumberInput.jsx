'use client'
import { useState, useEffect } from 'react'
import Image from "next/image"
import MinusIcon from "/public/minus.svg";
import PlusIcon from "/public/plus.svg";

export default function NumberInput( {name, value, min, max, onChange, disabled, currentPattern} ) {

  const handleIncrement = () => {
      if (value < max) {
        onChange({ target: { value: value + 1 } });
      }
    };
  
    const handleDecrement = () => {
      if (value > min) {
        onChange({ target: { value: value - 1 } });
      }
    };

    //value={value.toString().replace(/^0+/, '')}

    // perfect behavior:
    // - can backspace into blank field, but falls back to 0 when lost focus
    // - removes leading zero
    // - doesn't allow non-numerical input to affect value (minus sign, equals sign, etc)
    // - doesn't allow decimals at all (for now)

    return (
        <div className="flex items-center justify-center">
            <button onClick={handleDecrement} className={`${disabled ? "hidden" : ""} 
            bg-muted-blue hover:bg-arsenic w-8 h-8 flex justify-center items-center rounded-full`}>
                <Image src={MinusIcon} alt="Minus icon" className="w-4 h-4"/>
            </button>

            <input
              name={name}
              className={`${disabled ? (currentPattern ? "bg-subtle-gray border-none" : "bg-eerie-black border-none") : "bg-eerie-black"} 
                no-spinner mx-2 w-16 border-2 border-subtle-gray rounded-md text-center py-1
                focus:border-arsenic focus:ring-2 focus:ring-subtle-gray focus:outline-none`}
              type="number" 
              value={value} 
              min={min}
              max={max}
              onChange={onChange}
              disabled={disabled}
            />

            <button onClick={handleIncrement} className={`${disabled ? "hidden" : ""} 
            bg-muted-blue hover:bg-arsenic w-8 h-8 flex justify-center items-center rounded-full`}>
                <Image src={PlusIcon} alt="Plus icon" className="w-4 h-4"/>
            </button>
        </div>
    );
}
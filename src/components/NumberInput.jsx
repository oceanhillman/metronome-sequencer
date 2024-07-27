'use client'
import { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import MinusIcon from "/public/minus.svg";
import PlusIcon from "/public/plus.svg";

export default function NumberInput( props ) {
    const {name, value: initialValue, min, max, disabled, currentPattern, onBlur} = props;

    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (value === 0) {
            setValue('');
        }
    }, [value]);

    useEffect(() => {
        console.log(value);
    }, [value]);

    const handleClickIncrement = (event) => {
        event.preventDefault();
        if (value < max) {
            setValue((prevValue) => {
                const newValue = prevValue + 1;
                inputRef.current.focus();
                return newValue;
            });
        }
    };
    
      const handleClickDecrement = (event) => {
        event.preventDefault();
        if (value > min) {
          setValue((prevValue) => {
            const newValue = prevValue - 1;
            inputRef.current.focus();
            return newValue;
          });
        }
      };

      const handleTouchIncrement = (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
            if (value < max) {
                setValue((prevValue) => {
                  const newValue = prevValue + 1;
                  inputRef.current.focus();
                  return newValue;
                });
              }
        });
      };

    const handleTouchDecrement = (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
            if (value > min) {
                setValue((prevValue) => {
                    const newValue = prevValue - 1;
                    inputRef.current.focus();
                    return newValue;
                });
            }
        });
    };

    const handleChange = (event) => {

            setValue(Number(event.target.value));
        
    };

    function handleBlur() {
        if (value <= min) {
            setValue(min);
        } else if (value >= max) {
            setValue(max);
        }
        onBlur(value);
    }

    //value={value.toString().replace(/^0+/, '')}

    // perfect behavior:
    // - can backspace into blank field, but falls back to 0 when lost focus
    // - removes leading zero
    // - doesn't allow non-numerical input to affect value (minus sign, equals sign, etc)
    // - doesn't allow decimals at all (for now)

    
  return (
    <div className="flex items-center justify-center">
      <button onMouseDown={handleClickDecrement} onTouchEnd={handleTouchDecrement} className={`${disabled ? "hidden" : ""}  ${value === min ? "bg-subtle-gray hover:bg-subtle-gray" : "bg-muted-blue"}
        bg-muted-blue hover:bg-arsenic w-8 h-8 flex justify-center items-center rounded-full`}>
        <Image src={MinusIcon} alt="Minus icon" className="w-4 h-4"/>
      </button>

      <input
        ref={inputRef}
        name={name}
        className={`${disabled ? (currentPattern ? "bg-subtle-gray border-none" : "bg-inherit border-none") : "bg-black"} 
          no-spinner lg:mx-1 w-12 lg:w-16 border-2 border-subtle-gray rounded-md text-center py-1
          focus:border-arsenic focus:ring-2 focus:ring-subtle-gray focus:outline-none`}
        type="number" 
        value={value} 
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
      />

      <button onMouseDown={handleClickIncrement} onTouchEnd={handleTouchIncrement} className={`${disabled ? "hidden" : ""} ${value === max ? "bg-subtle-gray hover:bg-subtle-gray" : "bg-muted-blue"}
        bg-muted-blue hover:bg-arsenic w-8 h-8 flex justify-center items-center rounded-full`}>
        <Image src={PlusIcon} alt="Plus icon" className="w-4 h-4"/>
      </button>
    </div>
  );
}
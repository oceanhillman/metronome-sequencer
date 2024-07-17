import Image from "next/image"
import MinusIcon from "/public/minus.svg";
import PlusIcon from "/public/plus.svg";

export default function NumberInput( {value, min, max, onChange, } ) {

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

    return (
        <div className="flex items-center justify-center">
            <button onClick={handleDecrement} className="bg-gray-900 border border-gray-800 text-gray-200 w-8 h-8 flex justify-center items-center rounded-full hover:bg-blue-700 hover:border-blue-500 hover:text-gray-50">
                <Image src={MinusIcon} alt="Minus icon" className="w-4 h-4"/>
            </button>

            <input 
                className="no-spinner mx-2 w-16 bg-gray-900 border border-gray-700 text-gray-300 rounded-md text-center py-1 focus:border-blue-400 focus:ring-0 focus:shadow-outline-blue"
                type="number" 
                value={value} 
                min={min}
                max={max}
                onChange={onChange} 
            />

            <button onClick={handleIncrement} className="bg-gray-900 border border-gray-800 text-gray-200 w-8 h-8 flex justify-center items-center rounded-full hover:bg-blue-700 hover:border-blue-500 hover:text-gray-50">
                <Image src={PlusIcon} alt="Plus icon" className="w-4 h-4"/>
            </button>
        </div>
    );
}
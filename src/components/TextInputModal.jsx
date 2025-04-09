// src/components/TextInputModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloseIcon from "/public/close.svg"; // Adjust path if needed

// Define more neutral default styles
const defaultCancelStyle = "px-5 py-2 bg-gray-500 text-cultured rounded hover:opacity-80 transition-opacity";
const defaultConfirmStyle = "px-5 py-2 bg-cultured text-eerie-black rounded hover:opacity-80 transition-opacity"; // Example: Primary action color

const TextInputModal = ({
  isOpen,
  onClose,
  onConfirm, // This function will receive the input value: onConfirm(inputValue)
  title = "Enter Value",
  message, // Optional message/description
  placeholder = "Enter text...",
  initialValue = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonStyle = defaultConfirmStyle,
  cancelButtonStyle = defaultCancelStyle,
  inputLabel // Optional label for the input field
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  // Reset input value when modal opens or initialValue changes
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleConfirmClick = () => {
    onConfirm(inputValue); // Pass the current input value back
    // Closing the modal is now handled by the parent component after onConfirm logic
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Allow confirming with Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        handleConfirmClick();
    } else if (event.key === 'Escape') {
        onClose(); // Allow closing with Escape key
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> {/* Close on overlay click */}
      <div
        className="bg-dark-gunmetal text-cultured border-2 border-arsenic p-6 shadow-xl w-full max-w-md rounded-lg flex flex-col gap-4"
      >
        {/* Header with Title and Close Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold font-heading">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-cultured">
            <Image src={CloseIcon} alt="Close modal" width={20} height={20} />
          </button>
        </div>

        {/* Optional Message */}
        {message && <p className="text-sm text-cultured/80">{message}</p>}

        {/* Input Field */}
        <div className="w-full">
          {inputLabel && <label className="block text-sm font-medium text-cultured/90 mb-1">{inputLabel}</label>}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Handle Enter/Escape keys
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-arsenic border border-gray-600 rounded text-cultured focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            autoFocus // Automatically focus the input field
          />
        </div>

        {/* Footer with Action Buttons */}
        <div className="flex flex-row justify-center gap-3 pt-2"> {/* Align buttons right */}
          <button onClick={onClose} className={`${cancelButtonStyle}`}>
            {cancelText}
          </button>
          <button onClick={handleConfirmClick} className={`${confirmButtonStyle}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;
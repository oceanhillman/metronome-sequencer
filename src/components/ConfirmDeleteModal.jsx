// src/components/ConfirmDeleteModal.js
'use client';

import React from 'react';
import Image from 'next/image';
import CloseIcon from "/public/close.svg"; // Adjust path if your public folder is different

// Define default styles (can be overridden by props)
const defaultCancelStyle = "px-5 py-2 bg-cultured text-black";
const defaultConfirmStyle = "px-5 py-2 border-1 text-red-500 border-red-500";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?", // Default title
  message, // Message is required
  confirmText = "Delete", // Default confirm button text
  cancelText = "Cancel", // Default cancel button text
  confirmButtonStyle = defaultConfirmStyle, // Default confirm button style
  cancelButtonStyle = defaultCancelStyle, // Default cancel button style
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> {/* Added z-index */}
      <div className="bg-dark-gunmetal text-cultured border-1 border-red-500 p-6 shadow w-96 rounded"> {/* Added rounding */}
        <div className="text-right"> {/* Added margin-bottom */}
          <button onClick={onClose} className="w-[20px] h-[20px] ml-auto text-cultured hover:text-gray-400"> {/* Improved hover */}
            <Image src={CloseIcon} alt="Close modal" width={20} height={20} /> {/* Added alt text & size */}
          </button>
        </div>
        <h3 className="text-center text-2xl font-heading font-bold mb-3">{title}</h3> {/* Adjusted styles */}
        <p className="text-center mb-6">{message}</p> {/* Added margin-bottom */}
        <div className="flex flex-row justify-between">
          <button onClick={onClose} className={`${cancelButtonStyle} rounded hover:opacity-80 transition-opacity`}> {/* Added rounding/hover */}
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`${confirmButtonStyle} rounded hover:opacity-80 transition-opacity`}> {/* Added rounding/hover */}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
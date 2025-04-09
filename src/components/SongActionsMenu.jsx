// components/SongActionsMenu.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Needed if Rename/Duplicate link somewhere

// Simple Three Dots SVG Icon
const ThreeDotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" className="pointer-events-none">
    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
);


export default function SongActionsMenu({
  song,
  isOpen,
  onToggle, // Function to toggle this specific menu
  onClose,  // Function to close any open menu
  onCopyLink,
  onRename,
  onDuplicate,
  onDelete
}) {
  const menuRef = useRef(null);

  // Close menu if clicking outside of it
  useEffect(() => {
    if (!isOpen) return; // Only add listener if menu is open

    const handleClickOutside = (event) => {
      // If the click is outside the menuRef element, close the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when menu opens
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: remove event listener when menu closes or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // Re-run effect if isOpen or onClose changes

  const handleActionClick = (action) => {
    action(song.id, song.title); // Pass necessary info
    onClose(); // Close menu after action
  };

  return (
    // Relative positioning context for the absolute dropdown
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
           e.stopPropagation(); // Prevent triggering potential row click events
           onToggle(); // Toggle this specific menu
        }}
        className="p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-eerie-black focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Song actions" // Tooltip for accessibility
      >
        <ThreeDotsIcon />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-subtle-gray ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button" // Should ideally match an ID on the button if needed
        >
          <div className="py-1" role="none">
            {/* Menu Items */}
            <button
              onClick={() => handleActionClick(onCopyLink)}
              className="text-cultured block w-full text-left px-4 py-2 text-sm hover:bg-muted-blue/50"
              role="menuitem"
            >
              Copy Link
            </button>
            <button
              onClick={() => handleActionClick(onRename)}
              className="text-cultured block w-full text-left px-4 py-2 text-sm hover:bg-muted-blue/50"
              role="menuitem"
            >
              Rename
            </button>
            <button
              onClick={() => handleActionClick(onDuplicate)}
              className="text-cultured block w-full text-left px-4 py-2 text-sm hover:bg-muted-blue/50"
              role="menuitem"
            >
              Duplicate
            </button>
            <button
              onClick={() => handleActionClick(onDelete)}
              className="text-red-400 block w-full text-left px-4 py-2 text-sm hover:bg-muted-blue/50"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
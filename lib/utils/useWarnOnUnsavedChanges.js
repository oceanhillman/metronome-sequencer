import { useEffect } from 'react';

const useWarnOnUnsavedChanges = (hasUnsavedChanges) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        // Standard message to trigger the warning dialog
        const message = "You have unsaved changes. Are you sure you want to leave?";
        
        // For most browsers, setting event.returnValue triggers the native warning
        event.preventDefault();
        event.returnValue = message;  // This is required for most browsers to show the dialog
        return message;              // For some older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup event listener on component unmount
    return () => {
        localStorage.removeItem('unsavedChanges')
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
};

export default useWarnOnUnsavedChanges;

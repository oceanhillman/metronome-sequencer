'use client'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { isEqual } from 'lodash';

export default function UndoRedoButtons(props) {
    const { history, undo, hasChanges } = props;

    const [redos, setRedos] = useState([]);
    const [redoing, setRedoing] = useState(false);

    // useEffect(() => {
    //     if (redoing) {
    //         console.log("Redoing", redos);
    //         const latestRedo = redos[redos.length - 1];

    //         updatePlaylist(latestRedo.playlist);
    //         updateLayout(latestRedo.layout);
    //         updateTitle(latestRedo.title);

    //         setHistory(prev => [...prev, latestRedo]);
    //         setRedos(prev => prev.slice(0, -1));

    //         setRedoing(false);
    //     }
    // }, [redoing]);

    return (
        <div>
            <Button onClick={undo} disabled={history.length === 0 && hasChanges} variant="primary">
                Undo
            </Button>
            <Button onClick={() => setRedoing(true)} disabled={true} variant="primary">
                Redo
            </Button>
        </div>
    );
}

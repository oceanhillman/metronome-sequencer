export default function BeatTracker(props) {
    const { beatsPerMeasure, currentBeat } = props;

    const maxBeats = 32;
    
    const minConstraint = Math.max(1, beatsPerMeasure);

    const numBeats = Math.min(minConstraint, maxBeats);

    return (
        <div className="flex flex-row flex-wrap justify-center items-center">
            {Array.from({ length: numBeats }, (_, index) => (
                <div
                    key={index}
                    className={`${
                        currentBeat - 1 === index ? "bg-persian-pink" : "bg-cultured"
                    } h-3 w-3 rounded-full mx-1 my-1`}
                ></div>
            ))}
        </div>
    );

    
}

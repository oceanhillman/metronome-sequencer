import MySongs from "./MySongs";

export const dynamic = 'force-dynamic';

function MySongsPage() {
    return (
        <div className="flex min-h-screen flex-col items-center">
            <MySongs />
        </div>
    );
}

export default MySongsPage;

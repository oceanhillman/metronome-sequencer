
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="mt-auto flex flex-col w-full justify-center bg-eerie-black bottom-0">
            <div className="flex-grow py-12">
                {/* Main content goes here */}
            </div>
            <footer className="bg-eerie-black text-arsenic py-4">
                <div className="flex flex-col items-center mx-auto">
                    <p>Made by Ocean Hillman</p>
                </div>
            </footer>
        </div>
    );
}
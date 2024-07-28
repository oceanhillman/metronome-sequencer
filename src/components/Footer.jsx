
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="mt-auto flex flex-col w-full justify-center bg-eerie-black bottom-0">
            <div className="flex-grow py-12">
                {/* Main content goes here */}
            </div>
            <footer className="bg-eerie-black text-arsenic py-4">
                <div className="flex flex-col items-center mx-auto">
                    <p className="mb-1">Created by Ocean Hillman</p>
                    <button><a href="https://www.buymeacoffee.com/oceandev" target="_blank" className="no-underline text-cyan hover:text-blue-200">Buy Me a Coffee</a></button>
                </div>
            </footer>
        </div>
    );
}
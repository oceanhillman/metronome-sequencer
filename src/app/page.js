
import Image from 'next/image';
import EditorImage from '/public/editor_ss.png'
import MetronomeImage from '/public/metronome.png'

export default function Home() {
    return (
        <div className=" text-cultured font-roboto min-h-screen bg-eerie-black">
            <section className="bg-eerie-black overflow-hidden pt-24 pb-16">
                <div className="grid py-16 mx-auto lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12 max-w-screen-xl">
                    <div className="lg:mt-0 lg:col-span-5 lg:flex">
                        <Image src={MetronomeImage} className="w-full lg:w-[400px] lg:h-[400px] max-w-none" alt="mockup" />
                    </div>  
                    <div className="mr-auto place-self-center items-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl tracking-tight leading-none md:text-5xl xl:text-6xl">Master complex rhythms</h1>
                        <p className="max-w-2xl mb-6 font-thin lg:mb-8 md:text-lg lg:text-xl">Create custom metronome sequences of different tempo and time signatures to suit all of your time-keeping needs.</p>
                        <a href="/editor" className="inline-flex items-center justify-center px-5 py-3 shadow mr-3 text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                            Create Your First Song
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </a>
                        <a href="/get-premium" className="inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-persian-pink border-1 border-persian-pink hover:bg-arsenic focus:ring-4 focus:ring-gray-100">
                            Get Metronome Sequencer Pro
                        </a> 
                    </div>            
                </div>
            </section>

            <section className="py-24 bg-eerie-black">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-8 text-3xl tracking-tight leading-none md:text-4xl xl:text-5xl">More features than any other metronome</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="border-1 border-arsenic shadow-lg p-8">
                            <h3 className="text-4xl text-cultured">Sequence entire songs</h3>
                            <p className="mt-4">Unlike a standard metronome, you can program tempo changes, time signature shifts, and custom beat patterns from start to finish.</p>
                        </div>
                        <div className="border-1 border-arsenic shadow p-8">
                            <h3 className="text-4xl">Use free in your browser</h3>
                            <p className="mt-4">No downloads or installations—just open and start creating metronome sequences in your browser.</p>
                        </div>
                        <div className="border-1 border-arsenic shadow-lg p-8">
                            <h3 className="text-4xl">Save, share, collaborate</h3>
                            <p className="mt-4">Pro users gain access to upgraded features for personal and professional use.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-eerie-black overflow-hidden py-24">
                <div className="grid py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 max-w-screen-xl">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl tracking-tight leading-none md:text-5xl xl:text-6xl">Unlock exclusive features with <span className="text-persian-pink">Pro</span></h1>
                        <li className="max-w-2xl mb-6 font-thin lg:mb-8 md:text-lg"><span className="font-bold">Save & Organize Your Projects</span> – Keep a personal library of custom metronome sequences for different songs and practice sessions.</li>
                        <li className="max-w-2xl mb-6 font-thin lg:mb-8 md:text-lg"><span className="font-bold">Share Your Songs</span> – Send custom metronome sequences to bandmates, students, or friends with a simple link.</li>
                        <li className="max-w-2xl mb-6 font-thin lg:mb-8 md:text-lg  "><span className="font-bold">Collaborate With Others</span> – Want to tweak a sequence? Make edits to others' projects and save them to your song library.</li>
                        <a href="/get-premium" className="inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-persian-pink border-1 border-persian-pink hover:bg-arsenic focus:ring-4 focus:ring-gray-100">
                            Get Metronome Sequencer Pro
                        </a> 
                    </div>
                    <div className="lg:mt-0 lg:col-span-5 lg:flex shadow">
                        <Image src={EditorImage} className="w-full lg:w-[1000px] lg:h-[500px] max-w-none border-1 border-arsenic" alt="mockup" />
                    </div>                
                </div>
            </section>

            <section className="mt-16 py-16 bg-muted-blue">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-3xl  leading-none md:text-4xl xl:text-5xl">
                        Start sequencing now
                    </h1>
                    <div className="text-cultured">
                        <p>Customize your metronome, and start playing for free.</p>
                    </div>
                    <div className="mt-8">
                        <a href="/editor" className="inline-flex items-center justify-center px-5 py-3 shadow mr-3 text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                            Create Your First Song
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

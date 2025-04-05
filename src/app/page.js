import Image from 'next/image';
import EditorImage from '/public/editor_ss.png'
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import SimpleMetronome from '@/components/SimpleMetronome';

export default async function Home() {

    const session = await getSession();
  
    if (session) {
      redirect('/editor'); // Redirect logged-in users to the tool
    }

    return (
        <div className=" text-cultured font-roboto min-h-screen bg-eerie-black ">

            <section className="bg-eerie-black overflow-hidden pt-8 md:pt-28 pb-16">
                <div className="grid  xl:mx-32 md:gap-12 p-4 md:py-8 md:grid-cols-12 max-w-screen-xl xxl:max-w-full">
                    <div className="flex flex-col items-center justify-center md:mt-0 md:col-span-5 md:flex mb-4 md:m-0 ">
                        <SimpleMetronome />
                    </div>  
                    <div className="md:mr-auto place-self-center items-center md:col-span-7">
                        <h1 className="max-w-2xl mb-0 pb-[24px] text-4xl tracking-tight leading-none sm:text-5xl xl:text-6xl bg-gradient-to-r from-cyan via-persian-pink to-cultured inline-block text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">Master complex rhythms</h1>
                        <p className=" max-w-2xl mb-4 font-thin sm:text-md md:text-xl">Create custom metronome sequences of different tempo and time signatures to suit all of your time-keeping needs.</p>
                        <a href="/editor" className="w-full xxl:w-[320px] inline-flex items-center justify-center px-5 py-3 shadow xl:mr-3 text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                            Create Your First Song
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </a>
                        <a href="/get-pro" className="w-full xxl:w-[320px] mt-4 xl:mt-0 inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-persian-pink border-1 border-persian-pink hover:bg-arsenic focus:ring-4 focus:ring-gray-100">
                            Get Metronome Sequencer Pro
                        </a> 
                    </div>            
                </div>
            </section>

            <section className="py-16 bg-eerie-black">
                <div className="xxl:mx-32 p-4 md:text-center">
                    <h1 className="mb-4 text-3xl tracking-tight leading-none md:text-4xl xl:text-5xl text-cultured drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">More features than any other metronome</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="border-1 border-arsenic shadow-lg p-8 transition-transform duration-300 hover:scale-105">
                            <h3 className="text-4xl text-cultured">Sequence entire songs</h3>
                            <p className="mt-4 xxl:px-8">Unlike a standard metronome, you can program tempo changes, time signature shifts, and custom beat patterns from start to finish.</p>
                        </div>
                        <div className="border-1 border-arsenic shadow p-8 transition-transform duration-300 hover:scale-105">
                            <h3 className="text-4xl text-cultured">Use free in your browser</h3>
                            <p className="mt-4 xxl:px-8">No downloads or installations—just open and start creating metronome sequences in your browser.</p>
                        </div>
                        <div className="border-1 border-arsenic shadow-lg p-8 transition-transform duration-300 hover:scale-105">
                            <h3 className="text-4xl text-cultured">Save, share, collaborate</h3>
                            <p className="mt-4 xxl:px-8">Pro users gain access to upgraded features for personal and professional use.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-eerie-black overflow-hidden py-16">
                <div className="grid px-4 py-8 lg:gap-8 xl:gap-0 lg:py-16 grid-cols-12 max-w-screen-xl xxl:max-w-full xxl:mx-32 xxl:gap-x-12">
                    <div className="md:w-full place-self-center col-span-12 lg:col-span-7 xxl:col-span-6 text-left ">
                        <div className="lg:max-w-2xl xxl:max-w-full">
                            <div className="mb-4">
                                <h1 className="w-fit text-3xl tracking-tight leading-none md:text-4xl xl:text-5xl text-cultured drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">Unlock exclusive features with <span className="text-persian-pink">Pro</span></h1>
                            </div>
                            <li className="mb-4 font-thin md:text-lg"><span className="font-bold">Save & Organize Your Projects</span> – Keep a personal library of custom metronome sequences for different songs and practice sessions.</li>
                            <li className="mb-4 font-thin md:text-lg"><span className="font-bold">Share Your Songs</span> – Send custom metronome sequences to bandmates, students, or friends with a simple link.</li>
                            <li className="mb-4 font-thin md:text-lg"><span className="font-bold">Collaborate With Others</span> – Want to tweak a sequence? Make edits to others' projects and save them to your song library.</li>
                            <a href="/get-pro" className="w-full lg:[320px] inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-persian-pink border-1 border-persian-pink hover:bg-arsenic focus:ring-4 focus:ring-gray-100">
                                Get Metronome Sequencer Pro
                            </a>
                        </div>
                    </div>

                    
                    
                    <div className="mt-4 lg:mt-0 col-span-12 lg:col-span-5 lg:flex xxl:col-span-6 shadow">
                        <Image src={EditorImage} className="w-full lg:w-[1000px] lg:h-[500px] xxl:w-full xxl:h-auto max-w-none border-1 border-arsenic" alt="mockup" />
                    </div>                
                </div>
            </section>

            <section className="py-16 bg-muted-blue">
                <div className="px-4 text-center flex flex-col items-center">
                    <div className="w-fit">
                        <h1 className="pb-2 mb-2 text-3xl leading-none md:text-4xl xl:text-5xl bg-gradient-to-r from-cyan via-persian-pink to-cultured text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            Start sequencing now
                        </h1>
                        <div className="text-cultured">
                            <p>Customize your metronome, and start playing for free.</p>
                        </div>
                        <div className="mt-4">
                            <a href="/editor" className="w-full inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                                Create Your First Song
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

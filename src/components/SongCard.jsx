'use client'
import { format } from 'date-fns';
import Link from "next/link";
import { useState } from 'react'
import DeleteSongButton from '@/components/DeleteSongButton';
import Image from 'next/image';
import ShareIcon from '/public/share.svg'

export default function SongCard(props) {

    const { id, title, created_at, last_saved, onDelete } = props;

    const createdDate = new Date(created_at);
    const savedDate = new Date(last_saved);
    const created = format(createdDate, "MMMM dd, yyyy 'at' hh:mm a");
    const saved = format(savedDate, "MMMM dd, yyyy 'at' hh:mm a");

    function ShareButton() {
        return (
            <button className="w-[25px] h-[25px] rounded-md bg-gray-500 mr-4">
                <Image className="w-auto h-auto" src={ShareIcon} alt="Share icon"/>
            </button>
        );
    }

    return (
        <div className="grid grid-cols-12 rounded-xl min-h-[100px] bg-muted-blue hover:border-arsenic">
            <Link href={`/song/${id}`} className="col-span-11 p-2 rounded-xl bg-eerie-black border-2 border-muted-blue hover:bg-subtle-gray hover:border-arsenic">
                <h5 className="text-cultured text-lg font-sans">
                    {title}
                </h5>
                <p className="m-0 text-sm text-gray-400 font-sans">Created: {created}</p>
                <p className="m-0 text-sm text-gray-400 font-sans">Last saved: {saved}</p>
            </Link>
            <div className="col-span-1 flex justify-center items-center bg-muted-blue rounded-xl p-2">
                <ShareButton />
                <DeleteSongButton
                    songId={id}
                    songTitle={title}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Dashboard({ notes }) {
    const { props } = usePage();

    const handleLogout = () => {
        Inertia.post('/logout');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">My Notes</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <a
                href="/notes/create"
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
            >
                New Note
            </a>
            <div className="grid gap-4">
                {notes.map(note => (
                    <div key={note.id} className="bg-white p-4 rounded shadow">
                        <a href={`/notes/${note.id}/edit`}>
                            <h2 className="text-xl">{note.title}</h2>
                            <p className="text-gray-600">{note.content.substring(0, 100)}...</p>
                            {note.tags && (
                                <div className="mt-2">
                                    {note.tags.map(tag => (
                                        <span key={tag} className="bg-gray-200 px-2 py-1 rounded mr-2">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
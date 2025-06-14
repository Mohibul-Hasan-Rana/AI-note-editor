import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Dashboard({ notes }) {
    const { props } = usePage();

    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onSuccess: () => {
                alert('Logged out successfully.');
            },
            onError: (errors) => {
                alert('Logout failed: ' + JSON.stringify(errors));
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this note?')) {
            Inertia.delete(`/notes/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    Inertia.visit('/dashboard'); 
                }
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">My Notes</h1>
                <a
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                    Logout
                </a>
            </div>
            <button
                href="/notes/create"
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block cursor-pointer"
            >
                New Note
            </button>
            <div className="grid gap-4">
                {notes.length === 0 ? (
                    <p className="text-gray-500 text-center">No notes found. Click “New Note” to create one.</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-start">
                            <a href={`/notes/${note.id}/edit`} className="flex-1">
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
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
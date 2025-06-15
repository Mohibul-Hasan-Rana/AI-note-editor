import ToastNotification from "@/Pages/ToastNotification";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

export default function Dashboard({ notes }) {
    const { props } = usePage();

    // Safely get flash and success message, fallback to empty string
    const flash = props.flash || {};
    const successFlash = flash.success || "";

    const [successMessage, setSuccessMessage] = useState(successFlash);

    useEffect(() => {
        if (flash.success) {
            setSuccessMessage(flash.success);
        }
    }, [flash.success]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleLogout = () => {
        Inertia.post(
            "/logout",
            {},
            {
                onSuccess: () => {
                    alert("Logged out successfully.");
                },
                onError: (errors) => {
                    alert("Logout failed: " + JSON.stringify(errors));
                },
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this note?")) {
            Inertia.delete(`/notes/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage("Note deleted successfully.");
                    Inertia.visit('/dashboard');
                },
                onError: (errors) => {
                    alert("Failed to delete note: " + JSON.stringify(errors));
                },
            });
        }
    };

    return (
        <>
            <ToastNotification message={successMessage} />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Notes</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                <a
                    href="/notes/create"
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block cursor-pointer"
                >
                    New Note
                </a>

                {notes.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        No notes found. Click “New Note” to create one.
                    </p>
                ) : (
                    <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-300 pb-2 font-semibold text-gray-700">
                        <div className="col-span-5 text-center">Note</div>
                        <div className="col-span-4 text-center">Tags</div>
                        <div className="col-span-3 text-center">Actions</div>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-4">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="col-span-12 grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200"
                        >
                            {/* Note content - 5 columns */}
                            <a
                                href={`/notes/${note.id}/edit`}
                                className="col-span-5 block"
                            >
                                <h2 className="text-lg font-medium">{note.title}</h2>
                                <p className="text-gray-600">
                                    {note.content.length > 100
                                        ? note.content.substring(0, 100) + "..."
                                        : note.content}
                                </p>
                            </a>

                            {/* Tags - 4 columns */}
                            <div className="col-span-4 flex flex-wrap gap-2">
                                {note.tags && note.tags.length > 0 ? (
                                    note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic">No tags</span>
                                )}
                            </div>

                            {/* Actions - 3 columns */}
                            <div className="col-span-3 text-right space-x-2">
                                <a
                                    href={`/notes/${note.id}/edit`}
                                    className="inline-block bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Edit
                                </a>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="inline-block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

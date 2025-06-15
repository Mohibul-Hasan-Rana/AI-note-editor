import ToastNotification from "@/Pages/ToastNotification";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink, usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

export default function NoteEditor({ note }) {
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [summary, setSummary] = useState("");
    const { props } = usePage();
    const { flash } = usePage().props;
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingSummary, setLoadingSummary] = useState(false);

    const isEdit = !!note;

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Auto-save for existing notes
    const handleAutoSave = () => {
        if (isEdit && (title !== note.title || content !== note.content)) {
            Inertia.patch(
                `/notes/${note.id}/edit`,
                { title, content },
                {
                    preserveState: true,
                    replace: true,
                    onSuccess: () => {
                        setSuccessMessage("Note updated successfully.");
                    },
                    onError: (errors) => {
                        alert(
                            "Failed to auto-save note: " +
                                JSON.stringify(errors)
                        );
                    },
                }
            );
        }
    };

    // Create new note
    const handleSave = () => {
        if (!title || !content) {
            alert("Please enter both a title and content.");
            return;
        }
        Inertia.post(
            "/notes",
            { title, content },
            {
                onSuccess: () => {
                    setSuccessMessage("Note created successfully.");
                    setTitle("");
                    setContent("");
                    Inertia.visit("/dashboard");
                },
                onError: (errors) => {
                    alert("Failed to create note: " + JSON.stringify(errors));
                },
            }
        );
    };

    // AI Summarize
    
    const handleSummarize = () => {
    setSummary('');
    setLoadingSummary(true);

    const source = new EventSource(`/notes/${note.id}/summarize`);
    let result = '';

    source.onmessage = (event) => {
        if (event.data === '[DONE]') {
            source.close();
            setLoadingSummary(false);
            return;
        }

        result += event.data;
        setSummary(result);
    };

    source.onerror = (err) => {
        console.error('Stream error:', err);
        source.close();
        setLoadingSummary(false);
    };
};




    // Generate Tags
    const handleGenerateTags = () => {
        if (!isEdit) {
            alert("Please save the note before generating tags.");
            return;
        }
        Inertia.post(
            `/notes/${note.id}/tags`,
            {},
            {
                onSuccess: () => {
                    alert("Tags generated successfully.");
                },
                onError: (errors) => {
                    alert("Failed to generate tags: " + JSON.stringify(errors));
                },
            }
        );
    };

    // Logout
    const handleLogout = () => {
        Inertia.post(
            "/logout",
            {},
            {
                onSuccess: () => alert("Logged out"),
                onError: () => alert("Logout failed"),
            }
        );
    };

    return (
        <>
            <ToastNotification message={successMessage} />
            <div className="max-w-7xl mx-auto p-6">
                {/* Header with dynamic title + logout */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {isEdit ? "Edit Note" : "Create Note"}
                    </h1>
                    <div>
                        <InertiaLink
                            href="/dashboard"
                            className="bg-gray-500 mr-2 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                        >
                            Dashboard
                        </InertiaLink>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Title input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyUp={handleAutoSave}
                    className="w-full text-2xl mb-4 border-none focus:ring-0"
                    placeholder="Note Title"
                />

                {/* Content input */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyUp={handleAutoSave}
                    className="w-full h-60 border rounded p-4"
                    placeholder="Write your note..."
                />

                {/* Action buttons */}
                <div className="mt-4 space-x-2">
                    {!isEdit && (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                        >
                            Save Note
                        </button>
                    )}
                    {isEdit && (
                        <>
                            <button
                                onClick={handleSummarize}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                            >
                                {loadingSummary ? 'Summarizing...' : 'Summarize with AI'}
                            </button>
                            <button
                                onClick={handleGenerateTags}
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer"
                            >
                                Generate Tags
                            </button>
                        </>
                    )}
                </div>

                {/* AI summary display */}
                {summary && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-bold">Summary:</h3>
                        <p>{summary}</p>
                    </div>
                )}
            </div>
        </>
    );
}

import { InertiaLink } from "@inertiajs/inertia-react";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl mb-8 text-center">AI Note Editor</h1>
                <a
                    href="/auth/google/redirect"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg w-full block text-center"
                >
                    Login with Google
                </a>                
            </div>

            
            
        </div>
    );
}

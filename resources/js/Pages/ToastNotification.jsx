import React, { useEffect, useState } from 'react';

export default function ToastNotification({ message }) {
    
    if (!message) return null;
    return (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {message}
        </div>
    );
}

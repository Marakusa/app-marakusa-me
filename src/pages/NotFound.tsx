import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="m-auto w-150 flex flex-col items-center justify-center h-auto bg-zinc-900 text-zinc-300 gap-4 p-10 rounded-3xl shadow-lg shadow-black/20">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <h1>Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="text-sm bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;
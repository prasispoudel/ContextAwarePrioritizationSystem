//import React, { useContext } from 'react';
//import { AppContext } from '../App';

const HomePage = () => {
    const { appState } = React.useContext(AppContext);
    const history = ReactRouterDOM.useHistory();

    const handleManualMode = () => {
        history.push('/requirement-insertion');
    };

    const handleAutomatedPrioritization = () => {
        history.push('/auto-prioritize');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
                    Requirement Prioritization System
                </h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Choose your mode to get started with prioritizing your software requirements.
                </p>
                <div className="flex flex-col space-y-4 w-full">
                    <button 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
                        onClick={handleManualMode}
                    >
                        Manual Mode
                    </button>
                    <button 
                        className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
                        onClick={handleAutomatedPrioritization}
                    >
                        Automated Prioritization
                    </button>
                </div>
            </div>
            <footer className="mt-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Requirement Prioritization System
            </footer>
        </div>
    );
};

window.HomePage = HomePage;
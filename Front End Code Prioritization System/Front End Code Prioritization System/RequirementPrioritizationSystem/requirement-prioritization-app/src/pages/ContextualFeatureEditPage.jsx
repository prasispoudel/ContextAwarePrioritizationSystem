//import React, { useContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';
//import { AppContext } from '../App';

const ContextualFeatureEditPage = () => {
    const { appState, setAppState } = React.useContext(AppContext);
    const history = ReactRouterDOM.useHistory();
    const [selectedRequirement, setSelectedRequirement] = React.useState(null);
    const [contextualFeatures, setContextualFeatures] = React.useState({
        urgency: '',
        complexity: '',
        stakeholderCriticality: '',
        implementationEffort: '',
        securitySensitivity: '',
        businessValue: '',
        risk: '',
        requirementStability: ''
    });

    const handleSelectRequirement = (requirement) => {
        setSelectedRequirement(requirement);
        setContextualFeatures({ ...requirement.contextualFeatures });
    };

    // Fix: Update only the changed feature in contextualFeatures
    const handleFeatureChange = (feature, value) => {
        setContextualFeatures(prev => ({
            ...prev,
            [feature]: value
        }));
    };

    const handleConfirmEdit = () => {
        if (selectedRequirement) {
            const updatedRequirements = appState.requirements.map(req => 
                req.id === selectedRequirement.id 
                    ? { ...req, contextualFeatures } 
                    : req
            );
            setAppState({ ...appState, requirements: updatedRequirements });
            history.push('/prioritization-results');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
                    Edit Contextual Features
                </h1>
                {window.RequirementTable && (
                    React.createElement(window.RequirementTable, {
                        requirements: appState.requirements,
                        onSelect: handleSelectRequirement,
                    })
                )}
                {selectedRequirement && (
                    <div className="mt-4 w-full">
                        <h2 className="text-xl mb-2">Editing: {selectedRequirement.text}</h2>
                        {window.ContextualFeatureDropdowns && (
                            React.createElement(window.ContextualFeatureDropdowns, {
                                values: contextualFeatures,
                                onChange: handleFeatureChange,
                            })
                        )}
                        <button 
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full" 
                            onClick={handleConfirmEdit}
                        >
                            Confirm Edit
                        </button>
                    </div>
                )}
                <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
                    onClick={() => history.push('/prioritization-results')}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

window.ContextualFeatureEditPage = ContextualFeatureEditPage;

//export default ContextualFeatureEditPage;
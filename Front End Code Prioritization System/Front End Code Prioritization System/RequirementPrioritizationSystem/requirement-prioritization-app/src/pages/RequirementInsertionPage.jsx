//import React, { useContext, useState } from 'react';
//import { AppContext } from '../App';
//import axios from 'axios';

const RequirementInsertionPage = () => {
    const { appState, setAppState } = React.useContext(AppContext);
    const history = ReactRouterDOM.useHistory();
    const [requirementText, setRequirementText] = React.useState('');
    const [contextualFeatures, setContextualFeatures] = React.useState({
        urgency: 1,
        complexity: 1,
        stakeholderCriticality: 1,
        implementationEffort: 1,
        securitySensitivity: 1,
        businessValue: 1,
        risk: 1,
        requirementStability: 1,
    });
    const [editIdx, setEditIdx] = React.useState(null);

    const handleRequirementChange = (e) => {
        setRequirementText(e.target.value);
    };

    const handleContextualFeatureChange = (feature, value) => {
        setContextualFeatures((prev) => ({ ...prev, [feature]: value }));
    };

    const handleEdit = (idx) => {
        const req = appState.requirements[idx];
        setRequirementText(req.text);
        setContextualFeatures({ ...req.contextualFeatures });
        setEditIdx(idx);
    };

    const handleRemove = (idx) => {
        const updated = appState.requirements.filter((_, i) => i !== idx)
            .map((r, i) => ({ ...r, id: i + 1 })); // Reassign IDs
        setAppState(prev => ({
            ...prev,
            requirements: updated
        }));
        setRequirementText('');
        setContextualFeatures({
            urgency: 1,
            complexity: 1,
            stakeholderCriticality: 1,
            implementationEffort: 1,
            securitySensitivity: 1,
            businessValue: 1,
            risk: 1,
            requirementStability: 1,
        });
        setEditIdx(null);
    };

    const handleAddRequirement = () => {
        if (requirementText.trim() === '') return;

        if (editIdx !== null) {
            // Edit mode
            const updated = appState.requirements.map((r, idx) =>
                idx === editIdx
                    ? { ...r, text: requirementText, contextualFeatures }
                    : r
            );
            setAppState(prev => ({
                ...prev,
                requirements: updated
            }));
            setEditIdx(null);
        } else {
            // Add mode
            const newRequirement = {
                id: appState.requirements.length + 1,
                text: requirementText,
                contextualFeatures,
            };
            setAppState((prev) => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement],
            }));
        }

        setRequirementText('');
        setContextualFeatures({
            urgency: 1,
            complexity: 1,
            stakeholderCriticality: 1,
            implementationEffort: 1,
            securitySensitivity: 1,
            businessValue: 1,
            risk: 1,
            requirementStability: 1,
        });
    };

    const handleProceed = async () => {
        const requirementTexts = appState.requirements.map(req => req.text);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/dependencies/batch",
                { requirement_texts: requirementTexts }
            );
            // Save dependencies to state if needed
            setAppState(prev => ({
                ...prev,
                dependencies: response.data
            }));
            history.push('/dependency-analysis');
        } catch (error) {
            alert("Failed to fetch dependencies from API.");
            console.error(error);
        }
    };

    const handleResetData = () => {
        setAppState((prev) => ({
            ...prev,
            requirements: [],
        }));
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Insert Requirements</h1>
            <input
                type="text"
                value={requirementText}
                onChange={handleRequirementChange}
                placeholder="Software Requirement Statement"
                className="border p-2 mb-4 w-full"
            />
            {window.ContextualFeatureDropdowns && (
                React.createElement(window.ContextualFeatureDropdowns, {
                    onChange: handleContextualFeatureChange,
                    values: contextualFeatures,
                })
            )}
            <button
                onClick={handleAddRequirement}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Requirement
            </button>
            <button
                onClick={handleProceed}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
                Proceed to Dependency Analysis
            </button>
            <button
                onClick={handleResetData}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Reset Data
            </button>
            {window.RequirementTable
                ? (
                    <div className="overflow-x-auto rounded-lg shadow mt-6">
                        <table className="min-w-full border-collapse border border-gray-200 bg-white rounded-lg">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-gray-100 text-left">ID</th>
                                    <th className="border px-4 py-2 bg-gray-100 text-left">Statement</th>
                                    <th className="border px-4 py-2 bg-gray-100 text-left">Features</th>
                                    <th className="border px-4 py-2 bg-gray-100 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appState.requirements.map((req, idx) => (
                                    <tr key={req.id} className="hover:bg-blue-50 transition">
                                        <td className="border px-4 py-2">{req.id}</td>
                                        <td className="border px-4 py-2">{req.text}</td>
                                        <td className="border px-4 py-2">
                                            {req.contextualFeatures &&
                                                Object.entries(req.contextualFeatures).map(([k, v]) => (
                                                    <span key={k} className="mr-2 bg-gray-100 px-2 py-1 rounded text-xs">{k}: {v}</span>
                                                ))}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 shadow transition"
                                                onClick={() => handleEdit(idx)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                                                onClick={() => handleRemove(idx)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                : null
            }
        </div>
    );
};

window.RequirementInsertionPage = RequirementInsertionPage;
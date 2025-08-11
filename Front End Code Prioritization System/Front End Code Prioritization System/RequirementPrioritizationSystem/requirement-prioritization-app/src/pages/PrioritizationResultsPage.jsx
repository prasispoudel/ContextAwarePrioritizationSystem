//import React, { useContext, useState } from 'react';
//import { AppContext } from '../App';

const PrioritizationResultsPage = () => {
  const { appState, setAppState } = React.useContext(AppContext);
  const history = ReactRouterDOM.useHistory();
  const [selectedRequirement, setSelectedRequirement] = React.useState(null);
  const [newPriorityScore, setNewPriorityScore] = React.useState('');

  // Map and sort results by priorityScore descending
  const resultsForTable = appState.prioritizationResults
    .map((result, idx) => ({
      id: idx + 1,
      text: result.requirement_text,
      priorityScore: parseFloat(result.priority_score),
      numericFeatures: result.numeric_features,
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const handleSelect = (requirement) => {
    setSelectedRequirement(requirement);
    setNewPriorityScore(requirement.priorityScore);
  };

  const handleConfirm = () => {
    if (selectedRequirement) {
      const updatedResults = appState.prioritizationResults.map((result, idx) => {
        if (
          result.requirement_text === selectedRequirement.text ||
          idx + 1 === selectedRequirement.id
        ) {
          return {
            ...result,
            priority_score: newPriorityScore
          };
        }
        return result;
      });
      setAppState({ ...appState, prioritizationResults: updatedResults });
      setSelectedRequirement(null);
      setNewPriorityScore('');
    }
  };

  const handleExport = async () => {
    if (!resultsForTable.length) {
      window.ReactToastify.toast.error('No results to export.');
      return;
    }
    if (!window.confirm('Are you sure you want to export the results to Excel?')) {
      return;
    }
    // Export to Excel
    const exportData = resultsForTable.map(row => ({
      'Requirement ID': row.id,
      'Requirement Statement': row.text,
      'Priority Score': row.priorityScore
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auto Prioritization Results');
    XLSX.writeFile(workbook, 'auto_prioritization_results.xlsx');
    window.ReactToastify.toast.success('Exported results to auto_prioritization_results.xlsx');

    // Prepare retrain_model payload
    const items = appState.autoPrioritizationResults.map((result) => ({
      requirement_text: result.requirement_text,
      contextual_features: [3, 3, 3, 3, 3, 3, 3, 3], // Default values
      dependency_features: [0, 0, 0, 0], // Default values
      priority_score: result.priority_score
    }));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/retrain_model",
        { items }
      );
      window.ReactToastify.toast.success(response.data.message || "Retraining process started in background.");
    } catch (error) {
      window.ReactToastify.toast.error("Failed to start retraining.");
    }
    history.push('/auto-prioritize');
  };

  // Navigation handlers
  const handleEditFeatures = () => {
    history.push('/contextual-feature-edit');
  };

  const handleEditDependencies = () => {
    history.push('/dependency-edit');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
          Prioritization Results
        </h1>
        {window.RequirementTable && (
          React.createElement(window.RequirementTable, {
            requirements: resultsForTable,
            onSelect: handleSelect,
          })
        )}
        {selectedRequirement && (
          <div className="mt-4 w-full">
            <h2 className="text-xl mb-2">Edit Priority Score for Requirement ID: {selectedRequirement.id}</h2>
            <div className="flex space-x-2">
              <input
                type="number"
                value={newPriorityScore}
                onChange={(e) => setNewPriorityScore(e.target.value)}
                className="border p-2 rounded w-1/2"
              />
              <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded w-1/2">
                Confirm
              </button>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col space-y-2 w-full">
          <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Confirm and Export
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
            onClick={handleEditFeatures}
          >
            Edit Features
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded w-full"
            onClick={handleEditDependencies}
          >
            Edit Dependencies
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded w-full"
            onClick={() => history.push('/')}

          >
            Return to Home
          </button>
        </div>
        {window.ReactToastify && window.ReactToastify.ToastContainer
          ? React.createElement(window.ReactToastify.ToastContainer, { position: "top-right", autoClose: 4000 })
          : null}
      </div>
    </div>
  );
};

window.PrioritizationResultsPage = PrioritizationResultsPage;

//export default PrioritizationResultsPage;
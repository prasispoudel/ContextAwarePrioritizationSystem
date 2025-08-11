//import React, { useContext, useState } from 'react';
//import { AppContext } from '../App';
//import DependencyTable from '../components/DependencyTable';
//import DependencyInput from '../components/DependencyInput';

// UMD-compatible: No import/export, use global variables and hooks from ReactRouterDOM

const DependencyEditPage = () => {
  const { appState, setAppState } = React.useContext(AppContext);
  const history = ReactRouterDOM.useHistory();
  const [selectedDependency, setSelectedDependency] = React.useState(null);

  // Edit handler: pass dependency and index
  const handleEdit = (dependency, index) => {
    setSelectedDependency({ ...dependency, index });
  };

  // Remove handler: use index
  const handleRemove = (index) => {
    const updatedDependencies = appState.dependencies.filter((_, i) => i !== index);
    setAppState({ ...appState, dependencies: updatedDependencies });
    setSelectedDependency(null);
  };

  // Confirm edit handler: update dependency at index
  const handleConfirmEdit = (updatedDependency) => {
    if (selectedDependency && selectedDependency.index !== undefined) {
      const updatedDependencies = appState.dependencies.map((dep, idx) =>
        idx === selectedDependency.index
          ? {
              ...updatedDependency,
              source_text:
                appState.requirements.find(r => String(r.id) === String(updatedDependency.sourceId))?.text ||
                updatedDependency.sourceId,
              target_text:
                appState.requirements.find(r => String(r.id) === String(updatedDependency.targetId))?.text ||
                updatedDependency.targetId,
            }
          : dep
      );
      setAppState({ ...appState, dependencies: updatedDependencies });
      setSelectedDependency(null);
    } else {
      // Add new dependency
      const sourceReq = appState.requirements.find(r => String(r.id) === String(updatedDependency.sourceId));
      const targetReq = appState.requirements.find(r => String(r.id) === String(updatedDependency.targetId));
      setAppState({
        ...appState,
        dependencies: [
          ...appState.dependencies,
          {
            ...updatedDependency,
            source_text: sourceReq ? sourceReq.text : updatedDependency.sourceId,
            target_text: targetReq ? targetReq.text : updatedDependency.targetId,
          },
        ],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
          Edit Dependencies
        </h1>
        {window.DependencyTable && (
          React.createElement(window.DependencyTable, {
            dependencies: appState.dependencies,
            onEdit: handleEdit,
            onRemove: handleRemove,
          })
        )}
        {window.DependencyInput && (
          React.createElement(window.DependencyInput, {
            selectedDependency,
            onAddDependency: handleConfirmEdit,
            onCancelEdit: () => setSelectedDependency(null),
          })
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

// No export statement!
window.DependencyEditPage = DependencyEditPage;
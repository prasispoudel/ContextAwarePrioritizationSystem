//import React, { useContext, useEffect, useState } from 'react';
//import { useHistory } from 'react-router-dom';
//import { AppContext } from '../App';

const DependencyAnalysisPage = () => {
  const { appState, setAppState } = React.useContext(AppContext);
  const history = ReactRouterDOM.useHistory();
  const [selectedDependency, setSelectedDependency] = React.useState(null);

  // Add or update dependency handler for DependencyInput
  // When adding a new dependency, always set source_id and target_id using req.id
  const handleAddDependency = (newDependency) => {
    const sourceReq = appState.requirements.find(r => String(r.id) === String(newDependency.sourceId));
    const targetReq = appState.requirements.find(r => String(r.id) === String(newDependency.targetId));
    const dependencyWithText = {
      ...newDependency,
      source_text: sourceReq ? sourceReq.text : newDependency.sourceId,
      target_text: targetReq ? targetReq.text : newDependency.targetId,
      sourceId: sourceReq ? sourceReq.id : newDependency.sourceId,
      targetId: targetReq ? targetReq.id : newDependency.targetId,
      dependsOn: newDependency.dependsOn !== undefined ? newDependency.dependsOn : true
    };

    if (selectedDependency !== null && selectedDependency.index !== undefined) {
      const updatedDependencies = appState.dependencies.map((dep, idx) =>
        idx === selectedDependency.index ? dependencyWithText : dep
      );
      setAppState({ ...appState, dependencies: updatedDependencies });
      setSelectedDependency(null);
    } else {
      setAppState({
        ...appState,
        dependencies: [...appState.dependencies, dependencyWithText],
      });
    }
  };

  const handleEditDependency = (dependency, index) => {
    setSelectedDependency({ ...dependency, index });
  };

  const handleRemoveDependency = (index) => {
    const updatedDependencies = appState.dependencies.filter((_, i) => i !== index);
    setAppState({ ...appState, dependencies: updatedDependencies });
    setSelectedDependency(null);
  };

  const handleCancelEdit = () => {
    setSelectedDependency(null);
  };

  // Prioritize button handler: send raw contextual features (1-5) and call API
  const handlePrioritize = async () => {
    if (!appState.requirements.length || !appState.dependencies.length) {
      alert("Please add requirements and dependencies before prioritizing.");
      return;
    }

    // Prepare items array with requirement_text and contextual_features as [1-5] integers
    const items = appState.requirements.map((req) => ({
      requirement_text: req.text,
      contextual_features: [
        req.contextualFeatures.urgency,
        req.contextualFeatures.complexity,
        req.contextualFeatures.stakeholderCriticality,
        req.contextualFeatures.implementationEffort,
        req.contextualFeatures.securitySensitivity,
        req.contextualFeatures.businessValue,
        req.contextualFeatures.risk,
        req.contextualFeatures.requirementStability
      ]
    }));

    // Prepare dependency_pairs array using zero-based index for source_id and target_id
    const dependency_pairs = appState.dependencies.map(dep => {
      // Find index of source and target requirement in items array
      const sourceIdx = appState.requirements.findIndex(r => r.text === dep.source_text);
      const targetIdx = appState.requirements.findIndex(r => r.text === dep.target_text);

      return {
        source_id: sourceIdx,
        target_id: targetIdx,
        source_text: dep.source_text,
        target_text: dep.target_text,
        confidence: dep.confidence,
        depends_on: dep.dependsOn !== undefined ? dep.dependsOn : true
      };
    });

    // API payload
    const payload = {
      items,
      dependency_pairs
    };

    // Print payload to console before making API call
    console.log("Prioritization API payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/prioritize/batch",
        payload
      );
      setAppState(prev => ({
        ...prev,
        prioritizationResults: response.data
      }));
      history.push('/prioritization-results');
    } catch (error) {
      // Mock response for development if API fails
      const mockResults = items.map((item, idx) => ({
        requirement_text: item.requirement_text,
        priority_score: Math.random().toFixed(4),
        numeric_features: Array(12).fill(0).map(() => (Math.random() * 2 - 2).toFixed(6))
      }));
      setAppState(prev => ({
        ...prev,
        prioritizationResults: mockResults
      }));
      alert("Failed to prioritize requirements. Showing mock results.");
      history.push('/prioritization-results');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dependency Analysis</h1>
      {window.DependencyTable && (
        React.createElement(window.DependencyTable, {
          dependencies: appState.dependencies,
          onRemove: handleRemoveDependency,
          onEdit: (dep, idx) => handleEditDependency(dep, idx),
        })
      )}
      {window.DependencyInput && (
        React.createElement(window.DependencyInput, {
          onAddDependency: handleAddDependency,
          selectedDependency: selectedDependency,
          onCancelEdit: handleCancelEdit,
        })
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handlePrioritize}
      >
        Prioritize
      </button>
    </div>
  );
};

window.DependencyAnalysisPage = DependencyAnalysisPage;

//export default DependencyAnalysisPage;
const AutoPrioritizationPage = () => {
  const { appState, setAppState } = React.useContext(AppContext);
  const history = ReactRouterDOM.useHistory();
  const [requirementText, setRequirementText] = React.useState('');
  const [editIdx, setEditIdx] = React.useState(null);

  // Add or update requirement
  const handleAddRequirement = () => {
    if (!requirementText.trim()) return;
    if (editIdx !== null) {
      // Edit mode
      const updated = appState.autoRequirements.map((r, idx) =>
        idx === editIdx ? { ...r, text: requirementText.trim() } : r
      );
      setAppState(prev => ({
        ...prev,
        autoRequirements: updated
      }));
      setEditIdx(null);
    } else {
      // Add mode
      const newReq = {
        id: appState.autoRequirements.length + 1,
        text: requirementText.trim()
      };
      setAppState(prev => ({
        ...prev,
        autoRequirements: [...prev.autoRequirements, newReq]
      }));
    }
    setRequirementText('');
  };

  // Edit requirement
  const handleEdit = (idx) => {
    setRequirementText(appState.autoRequirements[idx].text);
    setEditIdx(idx);
  };

  // Remove requirement
  const handleRemove = (idx) => {
    const updated = appState.autoRequirements.filter((_, i) => i !== idx)
      .map((r, i) => ({ ...r, id: i + 1 })); // Reassign IDs
    setAppState(prev => ({
      ...prev,
      autoRequirements: updated
    }));
    setRequirementText('');
    setEditIdx(null);
  };

  // Prioritize handler: call API and navigate to results
  const handlePrioritize = async () => {
    if (!appState.autoRequirements.length) {
      alert('Please add at least one requirement.');
      return;
    }
    const payload = {
      requirement_texts: appState.autoRequirements.map(r => r.text)
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/autoprioritize",
        payload
      );
      setAppState(prev => ({
        ...prev,
        autoPrioritizationResults: response.data
      }));
      history.push('/auto-results');
    } catch (error) {
      // Mock response for development
      const mockResults = payload.requirement_texts.map((text, idx) => ({
        requirement_text: text,
        numeric_features: Array(12).fill(0).map(() => (Math.random() * 2 - 2).toFixed(6)),
        priority_score: (Math.random()).toFixed(2)
      }));
      setAppState(prev => ({
        ...prev,
        autoPrioritizationResults: mockResults
      }));
      alert("Failed to prioritize requirements. Showing mock results.");
      history.push('/auto-results');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
          Automated Prioritization
        </h1>
        <input
          type="text"
          value={requirementText}
          onChange={e => setRequirementText(e.target.value)}
          placeholder="Enter software requirement statement"
          className="border p-2 mb-4 w-full rounded"
        />
        <div className="flex space-x-2 mb-4 w-full">
          <button
            onClick={handleAddRequirement}
            className="bg-blue-500 text-white px-4 py-2 rounded w-1/2"
          >
            {editIdx !== null ? 'Update Requirement' : 'Add Requirement'}
          </button>
          <button
            onClick={handlePrioritize}
            className="bg-green-500 text-white px-4 py-2 rounded w-1/2"
          >
            Prioritize
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1 bg-gray-100">ID</th>
                <th className="border px-2 py-1 bg-gray-100">Requirement Statement</th>
                <th className="border px-2 py-1 bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appState.autoRequirements.map((req, idx) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{req.id}</td>
                  <td className="border px-2 py-1">{req.text}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(idx)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
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
      </div>
    </div>
  );
};

window.AutoPrioritizationPage = AutoPrioritizationPage;
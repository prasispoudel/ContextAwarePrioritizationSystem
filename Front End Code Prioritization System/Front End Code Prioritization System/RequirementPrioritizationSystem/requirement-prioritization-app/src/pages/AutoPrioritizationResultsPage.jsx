const AutoPrioritizationResultsPage = () => {
  const { appState } = React.useContext(AppContext);
  const history = ReactRouterDOM.useHistory();

  // Prepare results for table and sort by priority score (high to low)
  const resultsForTable = appState.autoPrioritizationResults
    .map((result, idx) => ({
      id: idx + 1,
      text: result.requirement_text,
      priorityScore: parseFloat(result.priority_score),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore); // Sort by priority score descending

  // Export to Excel
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

    // Prepare retrain_model payload using autoPrioritizationResults
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow">
          Automated Prioritization Results
        </h1>
        <div className="w-full overflow-x-auto mb-4">
          <table className="min-w-full border-collapse border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1 bg-gray-100">ID</th>
                <th className="border px-2 py-1 bg-gray-100">Statement</th>
                <th className="border px-2 py-1 bg-gray-100">Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {resultsForTable.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{row.text}</td>
                  <td className="border px-2 py-1">{row.priorityScore.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Confirm and Export
        </button>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded w-full mt-2"
          onClick={() => history.push('/')}
        >
          Return to Home
        </button>
        {window.ReactToastify && window.ReactToastify.ToastContainer
          ? React.createElement(window.ReactToastify.ToastContainer, { position: "top-right", autoClose: 4000 })
          : null}
      </div>
    </div>
  );
};

window.AutoPrioritizationResultsPage = AutoPrioritizationResultsPage;
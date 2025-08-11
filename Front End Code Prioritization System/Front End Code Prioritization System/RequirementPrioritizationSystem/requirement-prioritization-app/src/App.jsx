// No import/export statements! Use only global variables.

const { BrowserRouter, Switch, Route } = ReactRouterDOM;

const AppContext = React.createContext();

const initialState = {
  requirements: [],
  dependencies: [],
  prioritizationResults: [],
  autoRequirements: [], // For automated prioritization
  autoPrioritizationResults: [], // Results for automated prioritization
};

function App() {
  const [appState, setAppState] = React.useState(() => {
    const saved = localStorage.getItem('appState');
    return saved ? JSON.parse(saved) : initialState;
  });

  React.useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(appState));
  }, [appState]);

  function handleReset() {
    localStorage.removeItem('appState');
    setAppState(initialState);
  }

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <BrowserRouter>
        <div>
          {window.ReactToastify && window.ReactToastify.ToastContainer
            ? React.createElement(window.ReactToastify.ToastContainer, { position: "top-right", autoClose: 4000 })
            : null}
          <Switch>
            <Route exact path="/" component={window.HomePage || (() => <div>Home Page Not Found</div>)} />
            <Route path="/requirement-insertion" component={window.RequirementInsertionPage || (() => <div>Requirement Insertion Page Not Found</div>)} />
            <Route path="/dependency-analysis" component={window.DependencyAnalysisPage || (() => <div>Dependency Analysis Page Not Found</div>)} />
            <Route path="/prioritization-results" component={window.PrioritizationResultsPage || (() => <div>Prioritization Results Page Not Found</div>)} />
            <Route path="/contextual-feature-edit" component={window.ContextualFeatureEditPage || (() => <div>Contextual Feature Edit Page Not Found</div>)} />
            <Route path="/dependency-edit" component={window.DependencyEditPage || (() => <div>Dependency Edit Page Not Found</div>)} />
            <Route path="/auto-prioritize" component={window.AutoPrioritizationPage || (() => <div>Auto Prioritization Page Not Found</div>)} />
            <Route path="/auto-results" component={window.AutoPrioritizationResultsPage || (() => <div>Auto Prioritization Results Page Not Found</div>)} />
          </Switch>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

// No export statement!
// ReactDOM.render is called in index.html after this script loads.



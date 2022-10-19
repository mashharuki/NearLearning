import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/css/global.css';

import { 
  EducationalText, 
  SignInPrompt, 
  SignOutButton 
} from './assets/js/components/ui-components';

/**
 * App Component
 * @param {*} param0 
 * @returns 
 */
export default function App({ isSignedIn, helloNEAR, wallet }) {
  // state variable
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    // call getGreeting function
    helloNEAR.getGreeting()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  /**
   * changeGreeting method
   * @param {*} e 
   */
  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    // get new greeting
    const { greetingInput } = e.target.elements;
    
    // call setGreeting function
    helloNEAR.setGreeting(greetingInput.value)
      .then(async () => {return helloNEAR.getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          The contract says: <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <label>Change greeting:</label>
          <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain}
              id="greetingInput"
            />
            <button>
              <span>Save</span>
              <div className="loader"></div>
            </button>
          </div>
        </form>
        <EducationalText/>
      </main>
    </>
  );
}

import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor } from '@dfinity/agent';
import { koshiba_dapp_backend } from 'declarations/koshiba-dapp-backend';

function App() {
  const [greeting, setGreeting] = useState('');
  const [principal, setPrincipal] = useState('');
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const client = await AuthClient.create();
      setAuthClient(client);
      setIsAuthenticated(await client.isAuthenticated());

      if (client.isAuthenticated()) {
        Actor.agentOf(koshiba_dapp_backend).replaceIdentity(client.getIdentity());
      }
    }
    initAuth();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    koshiba_dapp_backend.greet(name).then(setGreeting);
  }

  async function handleWhoAmI() {
    const principal = await koshiba_dapp_backend.whoami();
    setPrincipal(`Your principal is: ${principal.toText()}`);
  }

  async function handleLogin() {
    if (!authClient) return;
    await authClient.login({
      identityProvider: getIdentityProvider(),
      onSuccess: async () => {
        setIsAuthenticated(await authClient.isAuthenticated());
        Actor.agentOf(koshiba_dapp_backend).replaceIdentity(authClient.getIdentity());
      },
    });
  }

  async function handleLogout() {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
  }

  function getIdentityProvider() {
    if (process.env.DFX_NETWORK === 'local') {
      return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/?anchor=123456`;
    } else if (process.env.DFX_NETWORK === 'ic') {
      return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
    } else {
      return `https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
    }
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <center>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
        <button onClick={handleWhoAmI}>Who am I?</button>
      </center>
      <section id="greeting">{greeting}</section>
      <section id="principal">{principal || 'No principal found'}</section>
    </main>
  );
}

export default App;

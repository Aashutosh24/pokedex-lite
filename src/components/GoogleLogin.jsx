import { useEffect } from "react";

function GoogleLogin({ setUser }) {
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "998630166906-4t8538t5auad8ft5406de8lg04pg8qmm.apps.googleusercontent.com",
      callback: handleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "medium" }
    );
  }, []);

  function handleLogin(response) {
    const userData = JSON.parse(atob(response.credential.split(".")[1]));
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  return <div id="googleBtn"></div>;
}

export default GoogleLogin;


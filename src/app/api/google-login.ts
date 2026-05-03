// ============ GOOGLE SIGN-IN INTEGRATION ============
// Đã tích hợp đầy đủ trong Login.tsx

// ============ SETUP INSTRUCTIONS ============
/*
1. Thêm script vào index.html:
   <script src="https://accounts.google.com/gsi/client" async defer></script>

2. Thêm Google Client ID vào .env:
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

3. Cấu hình Google Console:
   - Tạo OAuth 2.0 Client ID
   - Thêm authorized origins: http://localhost:5174 (dev)
   - Thêm authorized redirect URIs: http://localhost:5174 (dev)
*/

// ============ IMPLEMENTATION IN Login.tsx ============
/*
import { useState, useEffect } from "react";
import { loginWithGoogle } from "../api/auth";

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function Login() {
  const handleGoogleCallback = async (response: any) => {
    try {
      await loginWithGoogle({ idToken: response.credential });
      navigate("/dashboard");
    } catch (error) {
      setError("Google login failed");
    }
  };

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });

      // Render button
      const buttonElement = document.getElementById('google-signin-btn');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with'
        });
      }
    }
  }, []);

  return (
    <div id="google-signin-btn"></div>
  );
}
*/

export {};
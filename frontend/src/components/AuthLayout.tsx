import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg d-flex align-items-center justify-content-center p-3">
      <div className="container" style={{ maxWidth: 520 }}>
        {children}
      </div>
    </div>
  );
}

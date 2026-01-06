'use client';

import SplashScreen from './SplashScreen';

export default function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashScreen />
      {children}
    </>
  );
}


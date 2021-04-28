import React from 'react';
import Player from '../components/Player';
import Header from '../components/Header';
import { PlayerProvider } from '../hooks/player';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }) {
  return (
    <PlayerProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  );
}

export default MyApp;

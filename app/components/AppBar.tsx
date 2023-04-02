import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Nav } from './Nav';

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <span>Certifications</span>
      <Nav />
      <WalletMultiButton />
    </div>
  );
};

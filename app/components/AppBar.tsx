import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Nav } from './Nav';
import Link from 'next/link';

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Link href='/'>Certifications</Link>
      <Nav />
      <WalletMultiButton />
    </div>
  );
};

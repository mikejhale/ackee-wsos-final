import { Center, Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { CertificationForm } from '../components/CertificationForm';
import styles from '../styles/Home.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const Certifications: NextPage = () => {
  const { publicKey } = useWallet();

  return (
    <div className={styles.App}>
      <Head>
        <title>WSOS Final - Certifications</title>
      </Head>
      <AppBar />
      <Center>
        {publicKey ? (
          <Box>
            <Heading as='h1' size='l' color='white' ml={4} mt={8}>
              Add a Certification
            </Heading>
            <CertificationForm />
          </Box>
        ) : (
          <Box>
            <Heading as='h1' size='l' color='white' ml={4} mt={8}>
              You need to connect wallet first
            </Heading>
          </Box>
        )}
      </Center>
    </div>
  );
};

export default Certifications;

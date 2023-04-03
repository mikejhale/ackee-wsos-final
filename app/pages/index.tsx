import {
  Text,
  Box,
  Heading,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>WSOS Final</title>
      </Head>
      <AppBar />
      <Box p={24} color='white'>
        <Heading as='h1' size='xl' ml={4} mb={12} mt={8}>
          Welcome to Certifications!
        </Heading>
        <Text mb={8} fontWeight={700} fontSize={18}>
          You need to be connected to DEVNET!
        </Text>
        <Text mb={4}>
          This app allows a company or professional organization to add
          certifications for a uer or member. For example, a governing body may
          require its members to pursue consitnuing educations, and once they
          have done this they will be certified.
        </Text>
        <Text mb={4}>
          A future version of this app will allow the management of
          certification requirements, education providers, and course
          completion. For this initial release, you can add certifications, add
          a professional, and assign them a certification.
        </Text>
        <Text mb={4}>
          The app creates a PDA for each certification or professional, and when
          a certification is added to a professional that data is stored in the
          account. Every PDA is restricted to the address that created it, so
          multiple users can add their own certifications anf professionals.
        </Text>
        <Text mb={4}>
          To get started, add a new certification, then add a new profesisonal.
          Then you can select the certification to add for that professional.
          You may need to reload, the the UI needs some improvements, but this
          version is just intended to show the basic functionality and meet the
          requirements of the Ackee Winter School of Solana final project
          requirements.
        </Text>
        <Text mt={14}>
          <ChakraLink
            textDecoration={'underline'}
            href='https://github.com/mikejhale/ackee-wsos-final'
          >
            View source code
          </ChakraLink>
        </Text>

        <VStack mt={16} textAlign='center'>
          <Link href='/certifications'>Manage Certifications</Link>
          <Link href='/professionals'>Manage Professionals</Link>
        </VStack>
      </Box>
    </div>
  );
};

export default Home;

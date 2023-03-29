import {
  Box,
  HStack,
  VStack,
  Spacer,
  Button,
  Stack,
  Text,
  Select,
  Link,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  ProgramAccount,
} from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import NextLink from 'next/link';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl/ackee_wsos_final.json';

type ProCertProps = {
  publicKey: BN;
  certifications: BN[];
};

const ProCerts = (props: ProCertProps) => {
  const [certifications, setCertifications] = useState<ProgramAccount[]>([]);
  const [selectedCert, setSelectedCert] = useState('');
  const { connection } = useConnection();
  const wallet = useWallet();

  const idl_string = JSON.stringify(idl);
  const idl_object = JSON.parse(idl_string);
  const programID = new PublicKey(idl.metadata.address);

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      // @ts-ignore
      wallet,
      AnchorProvider.defaultOptions()
    );

    return provider;
  };

  const provider = getProvider();
  const program = new Program(idl_object, idl.metadata.address, provider);

  useEffect(() => {
    program.account.certification.all().then((certs) => {
      setCertifications(certs);
    });
  }, []);

  const handleCertSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCert(event.target.value);
  };

  const handleAddCertification = (publicKey: BN) => {
    console.log(publicKey.toString());
    console.log('Adding certification...');
  };

  return (
    <VStack>
      <Stack fontSize={24}>
        {props.certifications.length ? (
          <Text color='white'>
            {props.certifications.length} certifications
          </Text>
        ) : (
          <Text color='white' fontSize={16}>
            No Certifications
          </Text>
        )}
      </Stack>
      <Spacer h={14} />
      <VStack fontSize={24}>
        {certifications.length > 1 ? (
          <>
            <Select
              color='white'
              backgroundColor='darkgray'
              onChange={handleCertSelect}
            >
              <option style={{ background: 'darkgray' }} key={0} value=''>
                Select Certification
              </option>
              {certifications.map((cert) => (
                <option
                  style={{ background: 'darkgray' }}
                  key={cert.account.id}
                  value={cert.publicKey.toString()}
                >
                  {cert.account.id}
                </option>
              ))}
            </Select>
            <Button
              onClick={() => {
                handleAddCertification(props.publicKey);
              }}
            >
              Add Certification
            </Button>
          </>
        ) : (
          <NextLink href='/certifications' passHref>
            <Link
              className='next-link'
              fontWeight={700}
              fontSize={16}
              textColor={'white'}
            >
              Create New Certification
            </Link>
          </NextLink>
        )}
      </VStack>
    </VStack>
  );
};

export default ProCerts;

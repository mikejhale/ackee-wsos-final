import {
  VStack,
  Spacer,
  Button,
  Stack,
  Text,
  Select,
  Link,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { Program, AnchorProvider, BN, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import NextLink from 'next/link';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import idl from '../idl/ackee_wsos_final.json';

type ProCertProps = {
  publicKey: PublicKey;
  certifications: BN[];
};

const ProCerts = (props: ProCertProps) => {
  const [certifications, setCertifications] = useState<ProgramAccount[]>([]);
  const [proCerts, setProCerts] = useState<string[]>([]);
  const [selectedCert, setSelectedCert] = useState('');
  const [selectedCertID, setSelectedCertID] = useState('');
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
    program.account.certification
      .all([
        {
          memcmp: {
            offset: 8,
            bytes: provider.wallet.publicKey.toBase58(),
          },
        },
      ])
      .then((certs) => {
        setCertifications(certs);
      });
  }, []);

  const handleCertSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCertID(event.target.options[event.target.selectedIndex].text);
    setSelectedCert(event.target.value);
  };

  const handleAddCertification = async (publicKey: PublicKey) => {
    if (setSelectedCertID.length > 0 && selectedCert.length > 0) {
      const tx = await program.methods
        .addProCert()
        .accounts({
          professional: new PublicKey(publicKey),
          certification: new PublicKey(selectedCert),
        })
        .rpc();

      setProCerts([...proCerts, selectedCert]);
      console.log(
        'Certification ' + selectedCert + ' added to professional ' + publicKey
      );
    } else {
      console.log('Need to select a Certification first.');
    }
  };

  const getCert = async (certKey: BN) => {
    const cert = await program.account.certification.fetch(
      new PublicKey(certKey)
    );
    return cert;
  };

  return (
    <VStack>
      <Stack fontSize={24}>
        {props.certifications.map((c) => {
          const proCert = certifications.filter((pc) => {
            return pc.publicKey.toString() == c.toString();
          });
          return (
            <Text key={c.toString()} color='white' fontSize={14}>
              {proCert[0]?.account.id} - {proCert[0]?.account.year}
            </Text>
          );
        })}
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

import { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  ProgramAccount,
} from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl/ackee_wsos_final.json';
import { CertificationCard } from './CertificationCard';

export const CertificationForm: FC = () => {
  const [certId, setCertId] = useState('');
  const [certYear, setCertYear] = useState('');
  const [certifications, setCertifications] = useState<ProgramAccount[]>([]);
  const { connection } = useConnection();
  //const wallet = useAnchorWallet();
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

  const certFilter = [
    {
      memcmp: {
        offset: 8,
        bytes: provider.wallet.publicKey.toBase58(),
      },
    },
  ];

  useEffect(() => {
    program.account.certification.all(certFilter).then((certs) => {
      setCertifications(certs);
    });
  }, []);

  const handleAddCert = async (event: any) => {
    event.preventDefault();

    const [certificationPda, certBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode('certification'),
        utils.bytes.utf8.encode(certId),
        new BN(certYear).toArrayLike(Buffer, 'le', 2),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .addCertification(certId, certYear, certBump)
      .accounts({
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    const certFilter = [
      {
        memcmp: {
          offset: 8,
          bytes: provider.wallet.publicKey.toBase58(),
        },
      },
    ];

    program.account.certification.all(certFilter).then((certs) => {
      setCertifications(certs);
    });
    console.log('Account Created (Certification)', certificationPda.toString());
  };

  return (
    <>
      <Box
        p={4}
        display={{ md: 'flex' }}
        maxWidth='32rem'
        borderWidth={1}
        margin={2}
        justifyContent='center'
      >
        <form onSubmit={handleAddCert}>
          <FormControl isRequired>
            <FormLabel color='gray.200'>Certification ID</FormLabel>
            <Input
              id='certId'
              maxLength={24}
              color='gray.400'
              onChange={(event) => setCertId(event.currentTarget.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color='gray.200'>Certification Year</FormLabel>
            <Input
              id='certYear'
              min={2023}
              max={2073}
              color='gray.400'
              onChange={(event) => setCertYear(event.currentTarget.value)}
            />
          </FormControl>
          <Button width='full' mt={4} type='submit'>
            Add
          </Button>
        </form>
      </Box>

      <Box>
        {certifications.length > 0 ? (
          certifications.map((c) => (
            <CertificationCard
              key={c.account.id}
              id={c.account.id}
              year={c.account.year}
            />
          ))
        ) : (
          <Text fontSize={18} color='white'>
            You haven't added any Certifications yet
          </Text>
        )}
      </Box>
    </>
  );
};

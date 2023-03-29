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
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
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
import { ProfessionalCard } from './ProfessionalCard';

export const ProfessionalForm: FC = () => {
  const [proId, setProId] = useState('');
  const [professionals, setProfessionals] = useState<ProgramAccount[]>([]);
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

  const proFilter = [
    {
      memcmp: {
        offset: 8,
        bytes: provider.wallet.publicKey.toBase58(),
      },
    },
  ];

  useEffect(() => {
    program.account.professional.all(proFilter).then((pros) => {
      setProfessionals(pros);

      pros.map((p) => {
        console.log('Pro', p.account.id, p.account.authority.toString());
      });
    });
  }, []);

  const handleAddPro = async (event: any) => {
    event.preventDefault();

    const [professionalPda, proBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode('professional'),
        utils.bytes.utf8.encode(proId),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .addProfessional(proId, proBump)
      .accounts({
        professional: professionalPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    program.account.professional.all(proFilter).then((pros) => {
      setProfessionals(pros);
    });
    console.log('Account Created (Professional)', professionalPda.toString());
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
        <form onSubmit={handleAddPro}>
          <FormControl isRequired>
            <FormLabel color='gray.200'>Professional ID</FormLabel>
            <Input
              id='title'
              color='gray.400'
              onChange={(event) => setProId(event.currentTarget.value)}
            />
          </FormControl>

          <Button width='full' mt={4} type='submit'>
            Add
          </Button>
        </form>
      </Box>
      <Box>
        {professionals.length > 0 ? (
          professionals.map((p) => (
            <ProfessionalCard
              publicKey={p.publicKey}
              key={p.account.id}
              id={p.account.id}
              certifications={p.account.certifications}
            />
          ))
        ) : (
          <Text fontSize={18} color='white'>
            You haven't added any Professionals yet
          </Text>
        )}
      </Box>
    </>
  );
};

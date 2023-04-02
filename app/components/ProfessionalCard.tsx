import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import ProCerts from './ProCerts';
import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

type ProCardProps = {
  id: string;
  certifications: BN[];
  publicKey: PublicKey;
};

export const ProfessionalCard = (props: ProCardProps) => {
  return (
    <Box
      p={4}
      display={{ md: 'flex' }}
      maxWidth='32rem'
      borderWidth={1}
      margin={2}
      _hover={{
        background: 'gray.900',
      }}
    >
      <Stack
        w='full'
        align={{ base: 'center', md: 'stretch' }}
        textAlign={{ base: 'center', md: 'left' }}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
        mr={{ md: 6 }}
      >
        <HStack>
          <Text color='white'>{props.id}</Text>
          <ProCerts
            publicKey={props.publicKey}
            certifications={props.certifications}
          />
        </HStack>
      </Stack>
    </Box>
  );
};

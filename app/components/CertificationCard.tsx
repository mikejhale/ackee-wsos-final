import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';

type CertCardProps = {
  id: string;
  year: number;
};

export const CertificationCard = (props: CertCardProps) => {
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
          <Text color='white'>{props.year}</Text>
        </HStack>
      </Stack>
    </Box>
  );
};

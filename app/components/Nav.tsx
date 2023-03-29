import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';

export const Nav = () => {
  return (
    <HStack fontSize={24}>
      <Link href='/'>Professionals</Link>
      <Link href='/certifications'>Certifications</Link>
    </HStack>
  );
};

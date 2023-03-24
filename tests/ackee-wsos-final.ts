import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import Web3 from 'web3';
import { expect } from 'chai';
import { AckeeWsosFinal } from '../target/types/ackee_wsos_final';

describe('ackee-wsos-final', async () => {
  const professionalId = '475.' + (Math.floor(Math.random() * 90000) + 10000);

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AckeeWsosFinal as Program<AckeeWsosFinal>;

  const [professionalPda, bump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('professional'),
        anchor.utils.bytes.utf8.encode(professionalId),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  it('can create a professional', async () => {
    // get PDA for bank
    const [professionalPda, bump] =
      await anchor.web3.PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode('professional'),
          anchor.utils.bytes.utf8.encode(professionalId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .addProfessional(professionalId, bump)
      .accounts({
        professional: professionalPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let proAccount = await program.account.professional.fetch(professionalPda);
    expect(proAccount.id).equals(professionalId);
  });

  it('can add a certification', async () => {
    // get PDA for bank

    // get pubkey for cert (temp)
    const wallet = web3.Keypair.generate();

    const tx = await program.methods
      .addProCert(wallet.publicKey)
      .accounts({
        professional: professionalPda,
      })
      .rpc();

    let proAccount = await program.account.professional.fetch(professionalPda);
    console.log(proAccount.certifications.length);
    expect(proAccount.id).equals(professionalId);
  });
});

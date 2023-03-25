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
  const certificationId = 'CERT' + (Math.floor(Math.random() * 90000) + 10000);
  const certificationYear = 2024;

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AckeeWsosFinal as Program<AckeeWsosFinal>;

  const [professionalPda, proBump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('professional'),
        anchor.utils.bytes.utf8.encode(professionalId),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  const [certificationPda, certBump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('certification'),
        anchor.utils.bytes.utf8.encode(certificationId),
        new anchor.BN(certificationYear).toBuffer('le', 2),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  console.log(certificationPda);
  it('can create a professional', async () => {
    const tx = await program.methods
      .addProfessional(professionalId, proBump)
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
    const tx = await program.methods
      .addCertification(certificationId, certificationYear, certBump)
      .accounts({
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let certAccount = await program.account.certification.fetch(
      certificationPda
    );
    expect(certAccount.id).equals(certificationId);
  });

  it('can add certification to a professional', async () => {
    const tx = await program.methods
      .addProCert()
      .accounts({
        professional: professionalPda,
        certification: certificationPda,
      })
      .rpc();

    let certAccount = await program.account.certification.fetch(
      certificationPda
    );
    expect(certAccount.id).equals(certificationId);
  });
});

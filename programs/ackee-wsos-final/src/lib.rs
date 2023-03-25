use anchor_lang::prelude::*;

declare_id!("HyLnqpmqVQz4wdWtM7idAFuNb5C8HEWEeoP9g4WV6nt5");

#[program]
pub mod ackee_wsos_final {
    use super::*;

    // add professional
    pub fn add_professional(ctx: Context<AddProfressional>, id: String, bump: u8) -> Result<()> {
        let pro = &mut ctx.accounts.professional;
        pro.id = id;
        pro.authority = *ctx.accounts.user.key;
        pro.bump = bump;
        Ok(())
    }

    // add professional
    pub fn add_certification(
        ctx: Context<AddCertification>,
        id: String,
        year: u16,
        bump: u8,
    ) -> Result<()> {
        let cert = &mut ctx.accounts.certification;
        cert.id = id;
        cert.year = year;
        cert.bump = bump;
        Ok(())
    }

    //add certification to professional
    pub fn add_pro_cert(ctx: Context<AddProCert>) -> Result<()> {
        let pro = &mut ctx.accounts.professional;
        pro.certifications.push(ctx.accounts.certification.key());
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct AddProfressional<'info> {
    #[account(init, payer = user, space = 256, seeds = [
        b"professional",
        id.as_bytes(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub professional: Account<'info, Professional>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id: String, year: u16)]
pub struct AddCertification<'info> {
    #[account(init, payer = user, space = 256, seeds = [
        b"certification",
        id.as_bytes(),
        year.to_le_bytes().as_ref(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddProCert<'info> {
    #[account(mut, has_one = authority)]
    pub professional: Account<'info, Professional>,
    pub certification: Account<'info, Certification>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Professional {
    pub id: String,
    pub certifications: Vec<Pubkey>,
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
pub struct Certification {
    pub id: String,
    pub year: u16,
    pub bump: u8,
}

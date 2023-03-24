use anchor_lang::prelude::*;

declare_id!("HyLnqpmqVQz4wdWtM7idAFuNb5C8HEWEeoP9g4WV6nt5");

#[program]
pub mod ackee_wsos_final {
    use super::*;

    // add professional
    pub fn add_professional(ctx: Context<AddProfressional>, id: String, bump: u8) -> Result<()> {
        let pro = &mut ctx.accounts.professional;
        pro.id = id;
        pro.bump = bump;
        pro.authority = *ctx.accounts.user.key;
        Ok(())
    }

    // add certification to professional
    pub fn add_pro_cert(ctx: Context<AddProCert>, certification: Pubkey) -> Result<()> {
        let pro = &mut ctx.accounts.professional;
        pro.certifications.push(certification);
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

#[account]
pub struct Professional {
    pub id: String,
    pub certifications: Vec<Pubkey>,
    pub authority: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct AddProCert<'info> {
    #[account(mut, has_one = authority)]
    pub professional: Account<'info, Professional>,
    pub authority: Signer<'info>,
}

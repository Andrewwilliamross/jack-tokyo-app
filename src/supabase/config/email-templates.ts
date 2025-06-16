export const emailTemplates = {
  confirmation: {
    subject: 'Confirm your email address',
    template: `
      <h2>Welcome to our platform!</h2>
      <p>Please confirm your email address by clicking the link below:</p>
      <p>
        <a href="{{ .ConfirmationURL }}">Confirm Email Address</a>
      </p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  },
  magicLink: {
    subject: 'Your Magic Link',
    template: `
      <h2>Welcome back!</h2>
      <p>Click the link below to sign in to your account:</p>
      <p>
        <a href="{{ .MagicLink }}">Sign In</a>
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this link, you can safely ignore this email.</p>
    `,
  },
  resetPassword: {
    subject: 'Reset your password',
    template: `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="{{ .ConfirmationURL }}">Reset Password</a>
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  },
  changeEmail: {
    subject: 'Confirm your new email address',
    template: `
      <h2>Confirm Email Change</h2>
      <p>Click the link below to confirm your new email address:</p>
      <p>
        <a href="{{ .ConfirmationURL }}">Confirm New Email</a>
      </p>
      <p>If you didn't request this change, please contact support immediately.</p>
    `,
  },
} 
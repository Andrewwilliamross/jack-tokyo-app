export const authConfig = {
  siteUrl: process.env.VITE_SITE_URL || 'http://localhost:5173',
  redirectUrls: {
    confirmation: '/auth/callback',
    resetPassword: '/auth/reset-password',
    magicLink: '/auth/callback',
    changeEmail: '/auth/callback',
  },
  emailTemplates: {
    confirmation: {
      subject: 'Confirm your email address',
      template: 'confirmation',
    },
    magicLink: {
      subject: 'Your Magic Link',
      template: 'magic-link',
    },
    resetPassword: {
      subject: 'Reset your password',
      template: 'reset-password',
    },
    changeEmail: {
      subject: 'Confirm your new email address',
      template: 'change-email',
    },
  },
  providers: {
    email: {
      enabled: true,
      requireEmailConfirmation: true,
    },
    magicLink: {
      enabled: true,
    },
    // Add other providers as needed
    // google: {
    //   enabled: true,
    //   clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //   clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    // },
    // github: {
    //   enabled: true,
    //   clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    // },
  },
  security: {
    passwordMinLength: 6,
    passwordMaxLength: 72,
    passwordRequiresSpecialChar: true,
    passwordRequiresNumber: true,
    passwordRequiresUppercase: true,
    passwordRequiresLowercase: true,
    sessionExpiryInSeconds: 3600, // 1 hour
    refreshTokenExpiryInSeconds: 604800, // 7 days
  },
} 
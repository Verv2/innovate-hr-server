export const accountCreatedTemplate = (password: string): string => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="padding: 30px 40px;">
        <h2 style="color: #2c3e50;">Welcome to Our Platform 👋</h2>
        <p style="font-size: 16px; color: #555;">Dear User,</p>
        <p style="font-size: 16px; color: #555;">
          Your account has been <strong>successfully created</strong>. You can now log in using the temporary password below:
        </p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f3f6; border-left: 4px solid #007bff; font-size: 18px; font-weight: bold; color: #007bff;">
          ${password}
        </div>

        <p style="font-size: 16px; color: #555;">
          Please <a href="https://yourdomain.com/hr/login" style="color: #007bff; text-decoration: none;">log in</a> and change your password immediately.
        </p>

        <p style="font-size: 14px; color: #e74c3c;"><strong>⚠️ Do not share this password with anyone.</strong></p>

        <p style="font-size: 16px; color: #555; margin-top: 40px;">
          Best regards,<br />
          <strong>Verv Team</strong>
        </p>
      </div>
    </div>

    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
      © ${new Date().getFullYear()} Verv. All rights reserved.
    </div>
  </div>
  `;
};

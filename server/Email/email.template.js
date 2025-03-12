export const emailTemplate = function (email) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your ARAF Market Account</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: #ffffff;
      text-align: center;
      padding: 40px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .hero-image {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
      text-align: center;
    }
    .content h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #4CAF50;
    }
    .content p {
      margin: 0 0 20px;
      font-size: 16px;
    }
    .cta-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #45a049;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f1f1f1;
      color: #666666;
      font-size: 12px;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .icon {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
    }
    @media (max-width: 600px) {
      .email-container {
        width: 100%;
        border-radius: 0;
      }
      .header h1 {
        font-size: 24px;
      }
      .content h2 {
        font-size: 20px;
      }
      .cta-button {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to ARAF Market!</h1>
    </div>
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwv4sSr2RvUWUlnR4kMr89pYZ7HNBx0gA4PQ&s" alt="Welcome to ARAF Market" class="hero-image">
    <div class="content">
      <h2>Verify Your Account</h2>
      <p>Thank you for signing up for ARAF Market. To get started, please verify your email address by clicking the button below:</p>
      <a href="http://127.0.0.1:3000/auth/verify/${email}" class="cta-button">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4gKSA4wTYk8c2mE0CMgn5yvIk3dCOClZYSg&s" alt="Verify Icon" class="icon">
        Verify Your Account
      </a>
      <p>If you did not sign up for ARAF Market, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>This email was sent to ${email}. If you have any questions, please contact us at <a href="mailto:support@arafmarket.com">support@arafmarket.com</a>.</p>
      <p>&copy; 2025 ARAF Market. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

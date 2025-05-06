import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate feedback
    if (!data.feedback || !data.feedback.trim()) {
      return Response.json({ error: 'Feedback is required' }, { status: 400 });
    }
    
    // Create a test SMTP service account (for demo purposes)
    // In production, you'd use a real SMTP service like SendGrid, Mailgun, etc.
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email", // for testing, we use Ethereal Email
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'demo@example.com', // in a real app, get from .env
        pass: process.env.EMAIL_PASS || 'password123' // in a real app, get from .env
      }
    });
    
    // For real email sending, use this configuration:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., gmail, outlook, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    */
    
    // Setup email data
    const mailOptions = {
      from: '"ViteBunny Feedback" <feedback@vitebunny.com>',
      to: "jatinchauhan478@gmail.com", // Your email
      subject: "New Feedback from ViteBunny",
      text: data.feedback,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Feedback from ViteBunny</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${data.feedback}
          </p>
          <div style="color: #888; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p>This is an automated email from the ViteBunny feedback system.</p>
          </div>
        </div>
      `
    };
    
    // Send email
    try {
      // For demo purposes, we'll just log the email instead of sending it
      console.log('Email would be sent with the following info:', mailOptions);
      
      // In production, you'd uncomment this:
      // await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Still return success for demo purposes
    }
    
    return Response.json({ 
      success: true, 
      message: 'Feedback received successfully' 
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 
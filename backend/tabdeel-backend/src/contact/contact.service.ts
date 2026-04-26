import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendContactEmail(dto: CreateContactDto): Promise<{ success: boolean; message: string }> {
    const { name, email, subject, message } = dto;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Tabdeel Contact Form" <${this.configService.get<string>('SMTP_USER')}>`,
      to: 'tabdeel.eg@gmail.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151; width: 120px; vertical-align: top;">Name:</td>
              <td style="padding: 10px; color: #4b5563;">${name}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; color: #374151; vertical-align: top;">Email:</td>
              <td style="padding: 10px; color: #4b5563;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #374151; vertical-align: top;">Subject:</td>
              <td style="padding: 10px; color: #4b5563;">${subject}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; color: #374151; vertical-align: top;">Message:</td>
              <td style="padding: 10px; color: #4b5563; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
            This email was sent from the Tabdeel website contact form.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact email sent successfully from ${email}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send contact email: ${error.message}`);
      throw error;
    }
  }
}

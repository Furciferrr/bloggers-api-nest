import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailSender } from './../interfaces';

@Injectable()
export class MailSender implements IMailSender {
  async sendEmail(
    emailAddress: string,
    html: string,
  ): Promise<SMTPTransport.SentMessageInfo | undefined> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'setsko89@gmail.com',
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });
    console.log(html, emailAddress)
    //return {} as SMTPTransport.SentMessageInfo

    // send mail with defined transport object
    /* let info = await transporter.sendMail({
      from: '"Super Service" <foo@example.com>', // sender address
      to: emailAddress,
      subject: "Hello ✔", // Subject line
      text: "Hello", // plain text body
      html: `<a href="https://some-front.com/confirm-registration?${html}">https://some-front.com/confirm-registration?${html}</a>`, // html body
    }); */

    //return info;
    return {} as SMTPTransport.SentMessageInfo;
  }
}

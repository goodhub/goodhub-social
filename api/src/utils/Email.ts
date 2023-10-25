import boxen from 'boxen';

interface EmailProvider {
  sendEmail: (to: string, subject: string, body: string) => Promise<void>;
}

class TerminalEmailService implements EmailProvider {
  async sendEmail(to: string, subject: string, body: string) {
    console.log(
      boxen(`To: ${to}\nSubject: ${subject}\n\n${body}`, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      })
    );
  }
}

export const emailService: EmailProvider = (() => {
  // TODO: Implement a real email service
  return new TerminalEmailService();
})();

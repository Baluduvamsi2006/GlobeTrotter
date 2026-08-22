declare module "nodemailer" {
  interface Transporter {
    sendMail(options: Record<string, unknown>): Promise<unknown>;
  }

  function createTransport(options: Record<string, unknown>): Transporter;

  export default { createTransport };
}

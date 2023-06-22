import axios from "axios";

export interface EmailParams {
  _id: string;
  message?: string;
  to_email: string;
  from_name?: string;
  from_email?: string;
  link?: string;
  ticketType?: "it" | "maintenance";
  datetime?: string;
  description?: string;
}

export interface ISendEmailProps {
  template: string;
  params: EmailParams;
}

export const sendEmail = async (props: ISendEmailProps) => {
  await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: "smtp_server",
    template_id: props.template,
    user_id: "user_Jz3dLrqEkcq2B1IPSLb5k",
    template_params: props.params,
  });
};

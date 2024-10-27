import { ContactForm } from "./ContactForm";

export class ContactFormResponse {
  contactForm: ContactForm = new ContactForm();
  success: boolean = false;
  message: String = "";
}

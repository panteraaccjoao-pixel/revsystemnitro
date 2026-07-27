import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | REV SYSTEM',
  description: 'Finalize sua compra com segurança.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

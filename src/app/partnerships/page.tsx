import { permanentRedirect } from 'next/navigation';

export default function PartnershipsRedirect() {
  permanentRedirect('/contact?type=partnership');
}

import { permanentRedirect } from 'next/navigation';

export default function ProductsIndexRedirect() {
  permanentRedirect('/shop');
}

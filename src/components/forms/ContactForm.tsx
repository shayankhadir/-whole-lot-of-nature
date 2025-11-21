'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ name: '', email: '', message: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/email/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to send your message. Please try again.');
      }

      setStatus('success');
      setFormState({ name: '', email: '', message: '', phone: '' });
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div className="space-y-3 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border border-[#2E7D32]/30 rounded-lg p-6 text-white/90">
        <h3 className="text-xl font-semibold antialiased">We received your message 🌿</h3>
        <p>Our support team will reply from store@wholelotofnature.com soon.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm text-[#66BB6A] underline hover:text-[#2E7D32] transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border border-[#2E7D32]/30 rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium text-white/90">Name</label>
        <input
          className="mt-2 w-full rounded-lg border border-[#2E7D32]/50 bg-[#0D1B0F] px-4 py-2.5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent transition-all"
          placeholder="Your name"
          value={formState.name}
          onChange={handleChange('name')}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/90">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-lg border border-[#2E7D32]/50 bg-[#0D1B0F] px-4 py-2.5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent transition-all"
          placeholder="your@email.com"
          value={formState.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/90">Phone (optional)</label>
        <input
          type="tel"
          className="mt-2 w-full rounded-lg border border-[#2E7D32]/50 bg-[#0D1B0F] px-4 py-2.5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent transition-all"
          placeholder="+91 98765 43210"
          value={formState.phone}
          onChange={handleChange('phone')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/90">Message</label>
        <textarea
          rows={4}
          className="mt-2 w-full rounded-lg border border-[#2E7D32]/50 bg-[#0D1B0F] px-4 py-2.5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent transition-all"
          placeholder="Your message..."
          value={formState.message}
          onChange={handleChange('message')}
          required
        />
      </div>
      {status === 'error' && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#1e5628] text-white rounded-lg hover:from-[#66BB6A] hover:to-[#2E7D32] transition-all duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

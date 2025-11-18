'use client';

import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-3">
      <Share2 className="w-5 h-5 text-gray-100" />
      <button
        onClick={shareOnFacebook}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-5 h-5 text-primary-600" />
      </button>
      <button
        onClick={shareOnTwitter}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-5 h-5 text-primary-600" />
      </button>
      <button
        onClick={shareOnLinkedin}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5 text-primary-600" />
      </button>
    </div>
  );
}

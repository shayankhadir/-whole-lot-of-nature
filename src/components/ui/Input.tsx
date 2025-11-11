'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:text-sm transition-all ${
          error ? 'border-primary-300 focus:border-primary-500 focus:ring-primary-500/20' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-primary-700">{error}</p>
      )}
    </div>
  );
}
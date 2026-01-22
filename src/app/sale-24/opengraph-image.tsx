/* eslint-disable */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '24-hour plant sale';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col items-center justify-center bg-[#0d3512] text-[#daf2d0]">
        <div tw="text-[22px] uppercase tracking-[6px] text-[#86efbe]">24-hour sale</div>
        <div tw="text-[64px] font-bold mt-6 text-center">Whole Lot of Nature</div>
        <div tw="text-[30px] mt-4 text-center">Top indoor plants & care bundles</div>
        <div tw="mt-10 px-10 py-4 bg-[#22c55e] text-white rounded-full text-[24px] font-bold">Shop the drop →</div>
      </div>
    ),
    { ...size }
  );
}

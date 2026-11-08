import { ImageResponse } from 'next/og';

export const alt =
  'Amorea Bangladesh — Pakistani fashion, skincare, bags, and footwear';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at 50% 35%, #3b2608 0%, #17130b 42%, #080808 100%)',
          color: '#fff7df',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '1080px',
            height: '530px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(245, 158, 11, 0.55)',
            borderRadius: '28px',
            background: 'rgba(0, 0, 0, 0.24)',
          }}
        >
          <div
            style={{
              color: '#fbbf24',
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '0.38em',
            }}
          >
            AMOREA
          </div>
          <div
            style={{
              display: 'flex',
              width: '850px',
              marginTop: 32,
              textAlign: 'center',
              fontFamily: 'serif',
              fontSize: 58,
              lineHeight: 1.18,
            }}
          >
            Pakistani Fashion &amp; Luxury Lifestyle
          </div>
          <div
            style={{
              marginTop: 28,
              color: '#f5d992',
              fontSize: 28,
              letterSpacing: '0.08em',
            }}
          >
            SKINCARE · BAGS · FOOTWEAR · BANGLADESH
          </div>
        </div>
      </div>
    ),
    size,
  );
}

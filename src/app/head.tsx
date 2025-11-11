export default function Head() {
  const gsc = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  return (
    <>
      {gsc ? (
        <meta name="google-site-verification" content={gsc} />
      ) : null}
    </>
  );
}

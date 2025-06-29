import ResetPasswordClient from "../pageclient";

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams.token;

  return <ResetPasswordClient token={token} />;
}

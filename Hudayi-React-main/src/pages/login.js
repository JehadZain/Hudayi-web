// next
import Head from 'next/head';
// auth
import GuestGuard from '../auth/GuestGuard';
// sections
import Login from '../sections/auth/Login';
import { useLocales } from '../locales';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { translate } = useLocales();

  return (
    <>
      <Head>
        <title> {translate('Login_page_new_title')} </title>
      </Head>

      <GuestGuard>
        <Login />
      </GuestGuard>
    </>
  );
}

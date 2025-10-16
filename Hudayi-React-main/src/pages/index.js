import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();
  // TODO: remove this when have multiple langauge
  const { allLangs, currentLang, onChangeLang } = useLocales();
  useEffect(() => {
    onChangeLang("ar");
    if (router.pathname === '/') {
      router.push('/dashboard/analytics');
    }
  });

  return null;
}

// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { get } from '../../../../utils/functions';
import QuizNewEditForm from '../../../../sections/quizes/QuizNewEditForm';

import DashboardLayout from '../../../../layouts/dashboard';
import QuranQuizEditForm from '../../../../sections/quranQuizes/QuranQuizEditForm';
// components
import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getQuizze = async () => {
      const quizze = await get('quizzes', id);
      if (isMounted) {
        setData(quizze.data);
      }
    };

    getQuizze();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>
          {translate('quizes.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('quizes.quizes')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('quizes.quizes'), href: PATH_DASHBOARD.quizes.root },
            {
              name: translate('quizes.add'),
              href: PATH_DASHBOARD.quizes.modifiye('new'),
            },
          ]}
        />
        <QuizNewEditForm isEdit={id !== 'new'} currentProduct={data} />
      </Container>
    </>
  );
}

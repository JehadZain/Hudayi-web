// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import DashboardLayout from '../../../../layouts/dashboard';
import { get } from '../../../../utils/functions';

import { useSettingsContext } from '../../../../components/settings';
import InterviewNewEditForm from '../../../../sections/interview/InterviewNewEditForm';

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
  const [data, setData] = useState({});

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getInterview = async () => {
      const interview = await get('interviews', id);
      if (isMounted) {
        setData(interview.data);
      }
    };

    getInterview();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {' '}
          {translate('interviews.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('interviews.interviews')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('interviews.interviews'), href: PATH_DASHBOARD.interviews.root },
            {
              name: translate('interviews.add'),
              href: PATH_DASHBOARD.interviews.modifiye('new'),
            },
          ]}
        />
        <InterviewNewEditForm isEdit={id !== 'new' } currentItem={data} />
      </Container>
    </>
  );
}

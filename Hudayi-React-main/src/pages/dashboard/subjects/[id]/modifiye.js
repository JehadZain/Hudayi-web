// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../layouts/dashboard';
import SubjectNewEditForm from '../../../../sections/subject/SubjectNewEditForm';
import { useLocales } from '../../../../locales';

import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { get } from '../../../../utils/functions';

import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const [data, setData] = useState([]);
  const { translate } = useLocales();

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getSubject = async () => {
      const subject = await get('subjects', id);
      if (isMounted) {
        setData(subject.data);
      }
    };

    getSubject();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {' '}
          {translate('subjects.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('subjects.subjects')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('subjects.subjects'), href: PATH_DASHBOARD.subjects.root },
            {
              name: translate('subjects.add'),
              href: PATH_DASHBOARD.subjects.modifiye('new'),
            },
          ]}
        />
      
        <SubjectNewEditForm isEdit={id !== 'new'} currentProduct={data} />

      </Container>
    </>
  );
}

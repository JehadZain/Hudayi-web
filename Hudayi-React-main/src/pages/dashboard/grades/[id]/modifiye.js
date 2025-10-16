// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import GradeNewEditForm from '../../../../sections/grades/GradeNewEditForm';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
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

    const getGrade = async () => {
      const grade = await get('grades', id);
      if (isMounted) {
        setData(grade.data);
      }
    };

    getGrade();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {translate('grades.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('grades.grades')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('grades.grades'), href: PATH_DASHBOARD.notes },
            { name: translate('grades.add'), href: PATH_DASHBOARD.quranQuizes.modifiye('new') },
          ]}
        />
        <GradeNewEditForm isEdit={id !== 'new'} currentProduct={data} />
      </Container>
    </>
  );
}

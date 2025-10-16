// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Tab,
  Tabs,
 
  
  Container, IconButton, Button,
 
  
 
  
} from '@mui/material';
import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom'
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';

import {useTable } from '../../../../components/table';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

Mosques.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Mosques() {
  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
    if (newValue === 'tab1') {
      push('/dashboard/property');
    }
    if (newValue === 'tab2') {
      push('schools');
    }
     if (newValue === 'tab3') {
      push('mosques');
    }
  };

  const {
   
    setPage,
    //
   
    
  } = useTable();
  const { themeStretch } = useSettingsContext();
  const [filterStatus, setFilterStatus] = useState('all');

  const [tableData, setTableData] = useState([]);
  const { push } = useRouter();
  const { translate } = useLocales();
  const { asPath } = useRouter();
const { enqueueSnackbar } = useSnackbar();
  const getmosques = async () => {
    const mosques = await get('properties-mosques', null, enqueueSnackbar);
    setTableData(mosques.data);
  };
  useEffect(() => {
    getmosques();
  }, []);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('mosques.mosques_id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('mosques.mosques_name'),
    },

    {
      field: 'capacity',
      flex: 2,
      headerName: translate('mosques.capacity'),
    },

   
    {
      field: 'description',
      flex: 2,
      headerName: translate('mosques.description'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton onClick={() => push(PATH_DASHBOARD.mosques.view(params.row.id))}>
          <Iconify icon="ic:twotone-remove-red-eye" />
        </IconButton>
      ),
    },
  ];
  const getTabValue = () => {
    if (asPath.includes('schools')) {
      return 'tab2';
    }
    if (asPath.includes('mosques')) {
      return 'tab3';
    }
    return 'tab1';
  };
  return (
    <>
      <Head>
        <title>
          {translate('mosques.mosques')} | {translate('hudayi')}
        </title>
      </Head>

      <Container sx={{ display: 'flex', justifyContent: 'space-between' }} maxWidth={themeStretch ? false : 'xl'}>
    <Tabs
      value={getTabValue()}
      onChange={handleFilterStatus}
      sx={{
        px: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Tab key="tab1" label=" المراكز" value="tab1" />
      <Tab key="tab2" label="المدارس" value="tab2" />
      <Tab key="tab3" label="المساجد" value="tab3" />
    </Tabs>
    {/* <Button
      component={NextLink}
      href='dashboard/admins/mosques'
      variant="contained"
      startIcon={<Iconify icon="eva:plus-fill" />}
    >
      {translate('mosques.add')}
    </Button> */}
  </Container>
      <Container sx={{ marginTop: '30px'  }} >
      <DataGridCustom   data={tableData || []} columns={columns || []}  />
      </Container>
    </>
  );
}

// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { get, deleteFunc } from '../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../locales';
import DashboardLayout from '../../../../../layouts/dashboard';
import { useSnackbar } from '../../../../../components/snackbar';

import { useSettingsContext } from '../../../../../components/settings';
import DataGridCustom from '../../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../../components/iconify';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useBoolean } from '../../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

AdminsBranches.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function AdminsBranches() {
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  const getadminsBranches = async () => {
    const adminsBranches = await get('branch/admins', null, enqueueSnackbar);
    setTableData(adminsBranches.data?.data);
  };
  useEffect(() => {
    getadminsBranches();
  }, []);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('branch_admins.branch_id'),
      valueGetter: (paramsValue) => paramsValue.row.branch_id,
    },

    {
      field: 'image',
      flex: 3,
      headerName: translate('property_admins.image'),
      renderCell: (paramsCell) => {
        const { admin } = paramsCell.row;
        let avatarSrc;

        if (paramsCell.row?.user?.image) {
          avatarSrc = `${imageLink}/${admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={admin?.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.avatarman}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
          </>
        );
      },
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('branch_admins.branch_name'),
      valueGetter: (paramsGetter) => `${paramsGetter.row.branch?.name} `,
    },

    {
      field: 'teacher_user_full_name',
      flex: 1,
      headerName: translate('admins.admin_full_name'),
      valueGetter: (paramsGetter) =>
        `${paramsGetter.row.admin?.user?.first_name} ${paramsGetter.row.admin?.user?.last_name}`,
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.branchsAdmin.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.branchsAdmin.modifiye(paramsCell.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
          {/* <IconButton
            onClick={() => {
              setParams(paramsCell);
              confirm.onTrue();
            }}
          >
            <Iconify icon="material-symbols:delete" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const confirm = useBoolean();

  return (
    <>
      <Head>
        <title>
          {translate('branch_admins.branch_admins')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title={translate('delete')}
          content={translate('deleteTitle')}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteFunc('branch/admins', params.row.id);
                setTableData(tableData.filter((e) => e.id !== params.row.id));
                confirm.onFalse();
                enqueueSnackbar(translate('deleteMessage'), { variant: 'success' });
              }}
            >
              {translate('delete')}
            </Button>
          }
        />
        <CustomBreadcrumbs
          heading={translate('branch_admins.branch_admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('admins.admins'), href: PATH_DASHBOARD.users.adminRoot },
            {
              name: translate('branch_admins.branch_admins'),
              href: 'dashboard/admins/branch_admins ',
            },
          ]}
          // action={
          //   <Button
          //     component={NextLink}
          //     href={PATH_DASHBOARD.branchsAdmin.modifiye('new')}
          //     variant="contained"
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('branch_admins.add')}
          //   </Button>
          // }
        />
        <DataGridCustom data={tableData?.data || tableData || []} columns={columns} />
      </Container>
    </>
  );
}

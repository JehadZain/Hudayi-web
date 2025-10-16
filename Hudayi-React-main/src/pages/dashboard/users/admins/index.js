// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

import { useState, useEffect } from 'react';
import {
  Tab,
  Tabs,
  Card,
  Container,
  IconButton,
  Button,
  TableContainer,
  Grid,
  Stack,
} from '@mui/material';
import { get, deleteFunc } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import { useSnackbar } from '../../../../components/snackbar';

import { CustomAvatar } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import BookingWidgetSummary from '../../../../sections/general/booking/BookingWidgetSummary';
import ForbiddenIllustration from '../../../../sections/general/booking/ForbiddenIllustration';
import { useBoolean } from '../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

Admins.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Admins() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [params, setParams] = useState({});

  const { push } = useRouter();
  const [currentTab, setCurrentTab] = useState('admins');
  const handleFilterStatus = (event, newValue) => {
    setCurrentTab(newValue);
    getData(newValue);
  };
 
  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  const [tableData, setTableData] = useState();
  const { translate } = useLocales();
  const [adminsCount, setAdminsCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();


 
  
  const getData = async (link) => {
    const admins = await get(link ?? 'admins', null, enqueueSnackbar);
    const pagenation = { ...admins.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setTableData(admins.data?.data);
    setAdminsCount(admins?.hints?.total);
  };

  useEffect(() => {
    getData('admins');
  }, []);

  const columns = [
    {
      field: 'id',
      flex: 1,
      minWidth:100,
      headerName: translate('admins.AdminId'),
      valueGetter: (paramsGetter) => paramsGetter.row.id,
    },

    {
      field: 'image',
      flex: 1,
      headerName: translate('admins.image'),
      renderCell: (paramsCell) => {
        const { user, admin } = paramsCell.row;
        let avatarSrc;

        if (user?.image) {
          avatarSrc = `${imageLink}/${user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.first_name}
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
      field: 'teacher_user_full_name',
      flex: 1,
      minWidth:150,
      headerName: translate('admins.admin_full_name'),
      valueGetter: (paramsGetter) =>
        `${paramsGetter.row.user?.first_name} ${paramsGetter.row.user?.last_name}`,
    },

    {
      field: 'email',
      minWidth:200,
      headerName: translate('admins.email'),
      valueGetter: (paramsGetter) => paramsGetter.row.user?.email,
    },

    {
      field: 'phone',
      flex: 1,
      minWidth:150,
      headerName: translate('admins.phone'),
      valueGetter: (paramsGetter) => paramsGetter.row.user?.phone,
    },


    {
      field: 'birth place',
      minWidth:100,
      headerName: translate('teachers.birth_place'),
      valueGetter: (valueParams) => valueParams.row?.user?.birth_place,
    },


    {
      field: 'marital status',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.marital_status'),
      valueGetter: (valueParams) => {
        const status = valueParams.row?.marital_status;
        if (status === 'married') return translate('teachers.marital_status_married');
        if (status === 'single') return translate('teachers.marital_status_single');
        if (status === 'divorced') return translate('teachers.marital_status_divorced');
        if (status === 'widow') return translate('teachers.marital_status_widow');
        return status; // Fallback if translation is not available
      },
    },
    



   


    {
      field: 'birth date',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.birth_date'),
      valueGetter: (valueParams) => {
        const birthDate = valueParams.row.user?.birth_date;
        return birthDate ? format(new Date(birthDate), 'yyyy-MM-dd') : '';
      },
    },


    {
      field: 'current address',
      flex: 2,
      minWidth:150,
      headerName: translate('teachers.current_address'),
      valueGetter: (valueParams) => valueParams.row.user?.current_address,
    },


    {
      field: 'blood type',
      flex: 1,
      minWidth:100,
      headerName: translate('teachers.blood_type'),
      valueGetter: (valueParams) => valueParams.row.user?.blood_type,
    },


    {
      field: 'are there disease in family',
      flex: 1,
      minWidth:100,
      headerName: translate('students.are_there_disease_in_family'),
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === 1 || paramsFormatter.value === '1') {
          return translate('students.yes');
        }
        if (paramsFormatter.value === 0 || paramsFormatter.value === '0') {
          return translate('students.no');
        }
        return paramsFormatter.value;
      },
      valueGetter: (valueParams) => valueParams.row.user?.are_there_disease_in_family,
    },
    
    


    {
      field: 'disease name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.disease_name'),
      valueGetter: (valueParams) => valueParams.row.user?.disease_name,
    },


    {
      field: 'father name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.father_name'),
      valueGetter: (valueParams) => valueParams.row.user?.father_name,
    },


    {
      field: 'family disease note',
      flex: 2,
      minWidth:180,
      headerName: translate('teachers.family_disease_note'),
      valueGetter: (valueParams) => valueParams.row.user?.family_disease_note,
    },



    {
      field: 'identity number',
      flex: 2,
      minWidth:130,
      headerName: translate('teachers.identity_number'),
      valueGetter: (valueParams) => valueParams.row.user?.identity_number,
    },



   

    {
      field: 'is has disease',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.is_has_disease'),
      valueGetter: (valueParams) => {
        const hasDisease = valueParams.row.user?.is_has_disease;
        return hasDisease === 0 || hasDisease === "0"
          ? translate('students.yes')
          : translate('students.no');
      },
    },


    {
      field: 'is has treatment',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.is_has_treatment'),
      valueGetter: (valueParams) => {
        const hasDisease = valueParams.row.user?.is_has_treatment;
        return hasDisease === 0 || hasDisease === "0"
          ? translate('students.yes')
          : translate('students.no');
      },
    },
    

    {
      field: 'mother name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.mother_name'),
      valueGetter: (valueParams) => valueParams.row.user?.mother_name,
    },

    {
      field: 'children count',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.children_count'),
      valueGetter: (valueParams) => valueParams.row?.children_count,
    },
    
    {
      field: 'treatment name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.treatment_name'),
      valueGetter: (valueParams) => valueParams.row.user?.treatment_name,
    },


    {
      field: 'wives count',
      minWidth:100,
      flex: 2,
      headerName: translate('teachers.wives_count'),
      valueGetter: (valueParams) => valueParams.row.user?.wives_count,
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.users.adminView(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.users.adminModifiye(paramsCell.row.id))}>
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
  const orgAdminColumns = [
    {
      field: 'id',
      flex: 3,
      headerName: translate('org_admins.organization'),
      valueGetter: (paramsGetter) => paramsGetter.row.organization?.id,
    },

    {
      field: 'image',
      flex: 3,
      headerName: translate('org_admins.image'),
      renderCell: (paramsCell) => {
        let avatarSrc;

        if (paramsCell?.row?.admin?.user?.image) {
          avatarSrc = `${imageLink}/${paramsCell?.row?.admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt=""
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
      field: 'organization_id',
      flex: 3,
      headerName: translate('org_admins.name'),
      valueGetter: (paramsGetter) => paramsGetter.row.organization?.name,
    },

    {
      field: 'admin_user_full_name',
      flex: 3,

      headerName: translate('admins.admin_full_name'),

      valueGetter: (paramsGetter) =>
        `${paramsGetter.row.admin?.user?.first_name} ${paramsGetter.row.admin?.user?.last_name}`,
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      flex: 2,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.orgAdmins.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.orgAdmins.modifiye(paramsCell.row.id))}>
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
  const branchesAdminColumns = [
    {
      field: 'id',
      flex: 3,
      headerName: translate('branch_admins.branch_id'),
      valueGetter: (paramGetter) => paramGetter.row.branch?.id,
    },

    {
      field: 'image',
      flex: 3,
      headerName: translate('branch_admins.image'),
      renderCell: (paramsCell) => {
        const { user, admin } = paramsCell.row;
        let avatarSrc;

        if (admin?.user?.image) {
          avatarSrc = `${imageLink}/${admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.first_name}
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
      flex: 3,
      headerName: translate('branch_admins.branch_name'),
      valueGetter: (paramGetter) => paramGetter.row.branch?.name,
    },

    {
      field: 'teacher_user_full_name',
      flex: 3,

      headerName: translate('admins.admin_full_name'),

      valueGetter: (paramGetter) =>
        `${paramGetter.row.admin?.user?.first_name} ${paramGetter.row.admin?.user?.last_name}`,
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
  const propertyAdminColumns = [
    {
      field: 'id',
      flex: 3,
      headerName: translate('property_admins.property_id'),
      valueGetter: (paramsGetter) => paramsGetter.row.id,
    },

    {
      field: 'image',
      flex: 3,
      headerName: translate('property_admins.image'),
      renderCell: (paramsCell) => {
        const { user, admin } = paramsCell.row;
        let avatarSrc;

        if (admin?.user?.image) {
          avatarSrc = `${imageLink}/${admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.first_name}
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
      field: 'property',
      flex: 3,
      headerName: translate('property_admins.property_name'),
      valueGetter: (paramsGetter) => paramsGetter.row.property?.name,
    },

    {
      field: 'admin_user_full_name',
      flex: 3,

      headerName: translate('admins.admin_full_name'),

      valueGetter: (paramsGetter) =>
        `${paramsGetter.row.admin?.user?.first_name} ${paramsGetter.row.admin?.user?.last_name}`,
    },


    

        

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.users.adminView(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.users.adminModifiye(paramsCell.row.id))}>
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

  let selectedColumns = [];

  if (currentTab === 'admins') {
    selectedColumns = columns || [];
  } else if (currentTab === 'organization/admins') {
    selectedColumns = orgAdminColumns || [];
  } else if (currentTab === 'branch/admins') {
    selectedColumns = branchesAdminColumns || [];
  } else if (currentTab === 'property/admins') {
    selectedColumns = propertyAdminColumns || [];
  }
  let buttonLabel;
  if (currentTab === 'organization/admins') {
    buttonLabel = translate('org_admins.add');
  } else if (currentTab === 'branch/admins') {
    buttonLabel = translate('branch_admins.add');
  } else if (currentTab === 'property/admins') {
    buttonLabel = translate('property_admins.add');
  } else {
    buttonLabel = translate('admins.add');
  }

  const getLinkForTab = (tabValue) => {
    if (tabValue === 'organization/admins') {
      return PATH_DASHBOARD.orgAdmins.modifiye('new');
    }
    if (tabValue === 'branch/admins') {
      return PATH_DASHBOARD.branchsAdmin.modifiye('new');
    }
    if (tabValue === 'property/admins') {
      return PATH_DASHBOARD.propertyAdmin.modifiye('new');
    }
    return PATH_DASHBOARD.users.adminModifiye('new');
  };

  const buttonLink = getLinkForTab(currentTab);
  const confirm = useBoolean();
  return (
    <>
      <Head>
        <title>
          {translate('admins.admins')} | {translate('hudayi')}
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
                if (currentTab === 'organization/admins') {
                  deleteFunc('organization/admins', params.row.id);
                }
                if (currentTab === 'branch/admins') {
                  deleteFunc('branch/admins', params.row.id);
                }
                if (currentTab === 'property/admins') {
                  deleteFunc('property/admins', params.row.id);
                } else {
                  deleteFunc('admins', params.row.id);
                }

                setTableData(
                  tableData.data
                    ? tableData.data.filter((e) => e.id !== params.row.id)
                    : tableData.filter((e) => e.id !== params.row.id)
                );
                confirm.onFalse();
                enqueueSnackbar(translate('deleteMessage'), { variant: 'success' });
              }}
            >
              {translate('delete')}
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('admins.admin')}
              total={adminsCount === 0 ? 0 : adminsCount || 0}
              icon={<ForbiddenIllustration />}
            />
          </Grid>
        </Grid>

        <CustomBreadcrumbs
          heading={translate('admins.admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('admins.admins'), href: PATH_DASHBOARD.users.adminRoot },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(buttonLink);
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {buttonLabel}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />

        <Card>
          <Tabs
            value={currentTab}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
            }}
          >
            <Tab key="tab1" label={translate('admins.admins')} value="admins" />
            <Tab
              key="tab1"
              label={translate('org_admins.org_admins')}
              value="organization/admins"
            />

            <Tab
              key="tab2"
              label={translate('branch_admins.branch_admins')}
              value="branch/admins"
            />
            <Tab
              key="tab3"
              label={translate('property_admins.property_admins')}
              value="property/admins"
            />
          </Tabs>
          <DataGridCustom
            key={`tableData_${tableData?.data}`}
            data={tableData?.data || tableData || []}
            columns={selectedColumns}
            onRowClick={(params) => {
              if (currentTab === 'admins') {
               push(PATH_DASHBOARD.users.adminView(params.row.id))
              }
              else if (currentTab === 'organization/admins')
              {
                push(PATH_DASHBOARD.orgAdmins.view(params.row.id))
              } else if (currentTab === 'branch/admins') {
               push(PATH_DASHBOARD.branchsAdmin.view(params.row.id))
              }
              else  if (currentTab === 'property/admins') {
                push(PATH_DASHBOARD.users.adminView(params.row.id))
               }
            }}
            pageSize={pageSize}
            onPageChange={async (newPage) => {
              const page = newPage + 1;
              setPageNumber(page);
              await getData(`admins?page=${page}&perpage=${pageSize}`);
            }}


            columnVisibilityModel={{
              'children count': false,
              'marital status': false,
              'are there disease in family': false,
              "birth date":false,
              "birth place":false,
              "blood type":false,
              "current address":false,
              "disease name":false,
              "family disease note":false,
              "father name":false,
              "identity number":false,
              "is approved":false,
              "is has disease":false,
              "is has treatment":false,
              "mother name":false,
              "phone":false,
              "treatment name":false,
              "wives count":false,
             
              
  
  
            }}


            onPageSizeChange={async (newSize) => {
              setPageSize(newSize);
              await getData(`admins?page=${pageNumber}&perpage=${newSize}`);
            }}
            page={pageNumber}
            total={tableDataPageinate.total}
            isPagination
          />
        </Card>
      </Container>
    </>
  );
}
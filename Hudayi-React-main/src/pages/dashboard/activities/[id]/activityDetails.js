import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Typography, Stack, Tab, Card, Tabs, IconButton } from '@mui/material';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Label from '../../../../components/label';
import DashboardLayout from '../../../../layouts/dashboard';

import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';

import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

ActivityDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ActivityDetails() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState([]);
  const { push } = useRouter();
  const [searchFriends, setSearchFriends] = useState('');
  const { translate } = useLocales();
  const [activeTab, setActiveTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const handleTabChange = (event, newIndex) => {
    setActiveTab(newIndex);
  };

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getActivity = async () => {
      const activity = await get('activities', id, enqueueSnackbar);
      if (isMounted) {
        setData(activity.data);
      }
    };

    getActivity();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const iconify = (name) => <Iconify icon={name} />;

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, marginTop: 10, marginLeft: 5 }}>
      {/* <div style={{ display: 'block', textAlign: 'left' }}>
        <Label
          style={{ width: '50px', textAlign: 'center' }}
          color="default"
          onClick={() => push(PATH_DASHBOARD.quranQuizes.modifiye(data?.id))}
        >
          <span style={{ cursor: 'pointer', fontSize: '15px', width: '100px' }}>
            {translate('edit')}{' '}
          </span>
        </Label>
      </div> */}
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label={translate('interviews.descripion')} />
        <Tab
          label={
            <>
              {translate('interviews.participants')}
              <Label color="success" sx={{ ml: 1 }}>
                {data?.participants?.length}
              </Label>
            </>
          }
        />
      </Tabs>

      {activeTab === 0 && (
        <div style={{ position: 'relative' }}>
          <Typography marginBottom="30px" variant="h3">
            {data?.name}
          </Typography>

          <Stack direction="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} flexBasis="30%">
              <strong>{translate('activities.place')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.place}
              </small>
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="30%">
              <strong>{translate('activities.cost')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.cost}
              </small>
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="30%">
              {data?.image ? (
                <>
                  <strong>{translate('interviews.image')}</strong>
                  <img
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                    src={`${imageLink}/${data?.image}`}
                    alt="Interview"
                  />
                </>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="100%" marginTop={3}>
              <strong>{translate('activities.result')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.result}
              </small>
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="100%" marginTop={3}>
              <strong>{translate('activities.note')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.note}
              </small>
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="100%" marginTop={3}>
              <strong>{translate('activities.description')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.activity_type?.description}
              </small>
            </Stack>
          </Stack>
        </div>
      )}

      {activeTab === 1 && (
        <Stack spacing={2}>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            {data?.participants?.map((candidate) => (
              <a
                key={data.id}
                onClick={() => {
                  push(PATH_DASHBOARD.users.studentView(candidate?.student?.id));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    push(PATH_DASHBOARD.users.studentView(candidate?.student?.id));
                  }
                }}
                role="button" // Add role="button" to indicate it's a clickable element
                tabIndex={0}
                style={{ cursor: 'pointer' }} // Apply cursor pointer style
              >
                <Stack component={Card} direction="row" spacing={2} key={data.id} sx={{ p: 3 }}>
                  <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Iconify icon="mdi:eye-outline" />
                  </IconButton>
                  {candidate?.student?.user?.image === null ? (
                    <img
                      style={{ width: '48px', height: '48px' }}
                      src="/assets/logo/profile.png"
                      alt="Default Profile"
                    />
                  ) : (
                    <Avatar
                      alt={data.name}
                      src={`${imageLink}/${candidate.student?.user?.image}`}
                      variant="rounded"
                      style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                    />
                  )}

                  <Stack spacing={2}>
                    <ListItemText
                      primary={
                        <small>
                          {`${candidate?.student?.user?.first_name} ${candidate?.student?.user?.last_name}`}
                        </small>
                      }
                      secondary={candidate?.student?.id}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                        color: 'text.disabled',
                      }}
                    />
                  </Stack>
                </Stack>
              </a>
            ))}
          </Box>

          <Typography>{data?.content}</Typography>
        </Stack>
      )}
    </Stack>
  );

  const renderOverview = (
    <>
      <Stack component={Card} spacing={2} sx={{ p: 3, marginTop: 10, marginRight: 5 }}>
        <div style={{ display: 'flex' }}>
          <Iconify
            style={{ display: 'flex', marginLeft: '10px' }}
            icon="solar:calendar-date-bold"
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('activities.start_datetime')}</Typography>
            <small style={{ opacity: '0.7' }}>{data?.start_datetime}</small>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Iconify
            style={{ display: 'flex', marginLeft: '10px' }}
            icon="solar:calendar-date-bold"
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('activities.end_datetime')}</Typography>
            <small style={{ opacity: '0.7' }}>{data?.end_datetime}</small>
          </div>
        </div>
      </Stack>
    </>
  );

  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3, position: 'relative', marginRight: 5 }}
    >
      {data?.teacher?.user?.image ? (
        <img
          alt=""
          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
          src={`${imageLink}/${data?.teacher?.user?.image}`}
        />
      ) : (
        <img alt="" style={{ width: '64px', height: '64px' }} src="/assets/logo/profile.png" />
      )}

      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <strong>{translate('activities.activity_type_name')} </strong>:{' '}
          <small>{data?.activity_type?.name} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('activities.teacher_full_name')} </strong>:{' '}
          <small>
            {data?.teacher?.user?.first_name} {data?.teacher?.user?.last_name}{' '}
          </small>{' '}
        </Typography>
      </Stack>
      <IconButton
        style={{ position: 'absolute', left: '10px', top: '10px' }}
        onClick={() => push(PATH_DASHBOARD.users.teacherView(data?.teacher.id))}
      >
        <Iconify icon="ic:twotone-remove-red-eye" />
      </IconButton>
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}

        {renderCompany}
      </Grid>
    </Grid>
  );
}

import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Typography, Stack, Tab, Card, Tabs, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';

import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import Label from '../../../../components/label';

// _mock_

// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections

import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

InterviewDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InterviewDetails() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { push } = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const [searchFriends, setSearchFriends] = useState('');
  const { translate } = useLocales();
  const handleTabChange = (event, newIndex) => {
    setActiveTab(newIndex);
  };
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getInterview = async () => {
      const interview = await get('interviews', id, enqueueSnackbar);
      if (isMounted) {
        setData(interview.data);
      }
    };

    getInterview();

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
      </Tabs>

      {activeTab === 0 && (
        <div style={{ position: 'relative' }}>
          <Typography marginBottom="30px" variant="h3">
            {data?.name}
          </Typography>

          <Stack direction="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} flexBasis="30%">
              <strong>{translate('interviews.event_place')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.event_place}
              </small>
            </Stack>

            <Stack direction="row" spacing={1} flexBasis="30%">
              <strong>{translate('interviews.goal')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.goal}
              </small>
            </Stack>

            <Stack style={{ alignItems: 'center' }} flexBasis="30%" direction="row" spacing={1}>
              {data?.image ? (
                <>
                  <strong>{translate('interviews.image')}</strong>
                  <img
                    style={{
                      width: '40px',
                      height: '40px',
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
              <strong>{translate('interviews.comment')}</strong> :
              <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
                {data?.comment}
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
                tabIndex={0} // Add tabIndex to make the element focusable
                style={{ cursor: 'pointer' }} // Apply cursor pointer style
              >
                <Stack component={Card} direction="row" spacing={2} key={data.id} sx={{ p: 3 }}>
                  <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>

                  <Avatar
                    alt={candidate?.student?.user?.first_name}
                    src={`${imageLink}/${candidate?.student?.user?.image}`}
                    sx={{ width: 48, height: 48 }}
                  />

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
            <Typography variant="h6">{translate('interviews.date')}</Typography>
            <small style={{ opacity: '0.7' }}>{data?.date}</small>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Iconify style={{ display: 'flex', marginLeft: '10px' }} icon="iconoir:plug-type-l" />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('interviews.type')}</Typography>
            <small style={{ opacity: '0.7' }}>
              {data?.type === 'تربوي' && <p>{translate('interviews.educational')}</p>}
            </small>
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
        <img
          alt=""
          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
          src="/assets/logo/profile.png"
        />
      )}

      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <strong>{translate('interviews.type')} </strong>: <small>{data?.type} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('interviews.teacher_full_name')} </strong>:{' '}
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

  const renderStudent = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3, position: 'relative', marginRight: 5 }}
    >
      <Avatar
        alt={data?.name}
        src={`${imageLink}/${data?.student?.user?.image}`}
        variant="rounded"
        sx={{ width: 64, height: 64, objectFit: 'cover' }}
      />

      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <strong>{translate('students.studentId')} </strong>: <small> {data?.student_id} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('students.student_full_name')} </strong>:{' '}
          <small>
            {data?.student?.user?.first_name} {data?.student?.user?.last_name}{' '}
          </small>{' '}
        </Typography>
      </Stack>

      <IconButton
        style={{ position: 'absolute', left: '10px', top: '10px' }}
        onClick={() => push(PATH_DASHBOARD.users.studentView(data?.student.id))}
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
        {renderStudent}
      </Grid>
    </Grid>
  );
}

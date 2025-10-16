import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Typography, Stack, Card, IconButton } from '@mui/material';
import { useRouter } from 'next/router';

import Label from '../../../../components/label';

import { PATH_DASHBOARD } from '../../../../routes/paths';

import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';
// sections

import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

NoteDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function NoteDetails() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState([]);
  const { push } = useRouter();
  const { translate } = useLocales();
const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getNote = async () => {
      const note = await get('notes', id, enqueueSnackbar);
      if (isMounted) {
        setData(note?.data);
      }
    };

    getNote();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const iconify = (name) => <Iconify icon={name} />;

  const renderContent = (
    <div style={{ position: 'relative' }}>
      <Stack component={Card} spacing={3} sx={{ p: 3, marginTop: 10, marginLeft: 10 }}>
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
        <Typography variant="h4" />
        <Typography variant="h6">{translate('interviews.descripion')}</Typography>

        <Stack direction="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Stack marginTop={3} direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('notes.date')}</strong>:
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {new Date(data?.date).toDateString()}
            </small>
          </Stack>

          <Stack marginTop={3} direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('teachers.teacher_full_name')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.teacher?.user?.first_name} {data?.teacher?.user?.last_name}
            </small>
          </Stack>

          <Stack marginTop={3} direction="row" spacing={1} flexBasis="100%">
            <strong>{translate('notes.admin_content')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.admin_content}
            </small>
          </Stack>

          <Stack direction="row" spacing={1} flexBasis="100%" marginTop={3}>
            <strong>{translate('notes.teacher_content')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.teacher_content}
            </small>
          </Stack>
          <Stack direction="row" spacing={1} flexBasis="100%" marginTop={3}>
            <strong>{translate('students.student_full_name')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.student?.user?.first_name} {data?.student?.user?.last_name}
            </small>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );

  const renderOverview = (
    <Stack component={Card} spacing={3} sx={{ p: 3, marginTop: 10, marginRight: 10 }}>
      <Typography variant="h6">{translate('notes.date')}</Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Iconify icon="solar:calendar-date-bold" />
        <small style={{ opacity: '0.7' }}>{new Date(data?.date).toLocaleString()}</small>
      </Stack>
    </Stack>
  );

  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3, position: 'relative', marginRight: 10 }}
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
          <strong>{translate('notes.teacherId')}</strong>: <small>{data?.teacher?.id}</small>
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('notes.teacher_full_name')}</strong>:{' '}
          <small>
            {data?.teacher?.user?.first_name} {data?.teacher?.user?.last_name}
          </small>
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
      sx={{ p: 3, borderRadius: 2, mt: 3, position: 'relative', marginRight: 10 }}
    >
      {data?.teacher?.user?.image ? (
        <img
          alt=""
          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
          src={`${imageLink}/${data?.student?.user?.image}`}
        />
      ) : (
        <img alt="" style={{ width: '64px', height: '64px' }} src="/assets/logo/profile.png" />
      )}

      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <strong>{translate('students.studentId')}</strong>: <small>{data?.student?.id}</small>
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('students.student_full_name')}</strong>:{' '}
          <small>
            {data?.student?.user?.first_name} {data?.student?.user?.last_name}
          </small>
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

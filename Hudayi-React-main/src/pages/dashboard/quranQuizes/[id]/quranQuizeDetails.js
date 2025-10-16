import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Typography, Stack, Card, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { ST } from 'next/dist/shared/lib/utils';

import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import Label from '../../../../components/label';
import { PATH_DASHBOARD } from '../../../../routes/paths';

import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

QuranQuizeDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function QuranQuizeDetails() {
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

    const getQuizze = async () => {
      const quizze = await get('quran-quizzes', id, enqueueSnackbar);
      if (isMounted) {
        setData(quizze.data);
      }
    };

    getQuizze();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const iconify = (name) => <Iconify icon={name} />;

  function formatPageList(pageString) {
    if (!pageString) {
      return null;
    }

    const pages = pageString.split(',').map((page) => `[${page.trim()}]`);

    return pages.join(', ');
  }

  const getMarks = () => {
  // Equivalent translation map
  const marks = {
    "100": translate('quranQuizes.excellent'),
    "75": translate('quranQuizes.veryGood'),
    "50": translate('quranQuizes.good'),
    "25":  translate('quranQuizes.average'),
    "0": translate('quranQuizes.fail'),
  };
  return marks;
};

const getScoreLabel = (score) => {
  const marks = getMarks();
  // Find the appropriate label based on score thresholds
  const thresholds = Object.keys(marks)
    .map(Number)
    .sort((a, b) => b - a);
   
  // Use find to get the first threshold that the score meets
  const matchingThreshold = thresholds.find(threshold => score >= threshold);
  
  // Return matching label or default to fail
  return marks[matchingThreshold ?? "0"];
};


  const renderContent = (
    <div style={{ position: 'relative' }}>
      <Stack component={Card} spacing={3} sx={{ p: 3, marginLeft: 5, marginTop: 10 }}>
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
        <Typography variant="h3">{data?.name}</Typography>
        <Stack direction="row" flexWrap="wrap">
          <Stack direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('quranQuizes.juz')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.juz}
            </small>
          </Stack>

          <Stack direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('quranQuizes.score')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {getScoreLabel(data?.score)}
            </small>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <strong>{translate('quranQuizes.page')}</strong> :
          <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
            {formatPageList(data?.page)}
          </small>
        </Stack>
      </Stack>
    </div>
  );

  const renderOverview = (
    <>
      <Stack component={Card} spacing={2} sx={{ p: 3, marginRight: 5, marginTop: 10 }}>
        <div style={{ display: 'flex' }}>
          <Iconify
            style={{ display: 'flex', marginLeft: '10px' }}
            icon="solar:calendar-date-bold"
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('quranQuizes.date')}</Typography>
            <small style={{ opacity: '0.7' }}>{new Date(data?.date).toLocaleString()}</small>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Iconify style={{ display: 'flex', marginLeft: '10px' }} icon="iconoir:plug-type-l" />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('quranQuizes.exam_type')}</Typography>
            <small style={{ opacity: '0.7' }}>{data?.exam_type==="recitationFromQuran"?translate("quranQuizes.recitationFromQuran"):translate("quranQuizes.curriculum")}</small>
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
          <strong>{translate('quranQuizes.teacherId')} </strong>:{' '}
          <small>{data?.teacher?.id} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('quranQuizes.teacher_full_name')} </strong>:{' '}
          <small>
            {data?.teacher?.user?.first_name} {data?.teacher?.user?.last_name}{' '}
          </small>{' '}
        </Typography>
      </Stack>
      <IconButton
        style={{ position: 'absolute', left: '10px', top: '10px' }}
        onClick={() => push(PATH_DASHBOARD.users.teacherView(data?.teacher?.id))}
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
      {data?.student?.user?.image ? (
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
          <strong>{translate('quranQuizes.student_id')} </strong>:{' '}
          <small>{data?.student?.id} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('quranQuizes.student_full_name')} </strong>:{' '}
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

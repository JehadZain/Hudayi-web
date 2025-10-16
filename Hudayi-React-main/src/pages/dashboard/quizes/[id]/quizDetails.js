import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Typography, Stack, Card, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { format, parse } from 'date-fns';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Label from '../../../../components/label';

// auth
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

QuizDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function QuizDetails() {
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
      const quizze = await get('quizzes', id, enqueueSnackbar);
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
        <Stack direction="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('quizes.quiz_subject')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.quiz_subject}
            </small>
          </Stack>

          <Stack direction="row" spacing={1} flexBasis="50%">
            <strong>{translate('quizes.score')}</strong> :
            <small style={{ opacity: '0.7', fontSize: '16px', lineHeight: '25px' }}>
              {data?.score}
            </small>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );

  const getQuizTypeValue = (value) => {
    if (value === "quran") {
      return translate("quran");
    }
    if (value === "curriculum") {
      return translate("quranQuizes.curriculum");
    }
    if (value === "correctArabicReading") {
      return translate("correctArabicReading");
    }
    return translate("not_available");
  };

  const renderOverview = (
    <>
      <Stack component={Card} spacing={2} sx={{ p: 3, marginRight: 5, marginTop: 10 }}>
        <div style={{ display: 'flex' }}>
          <Iconify
            style={{ display: 'flex', marginLeft: '10px' }}
            icon="solar:calendar-date-bold"
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('quizes.date')}</Typography>

            <small style={{ opacity: '0.7' }}>
              {data?.date ? format(new Date(data?.date), 'yyyy-MM-dd') : ''}
            </small>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Iconify style={{ display: 'flex', marginLeft: '10px' }} icon="ri:time-line" />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('quizes.time')}</Typography>

            <small style={{ opacity: '0.7' }}>{data?.time && data?.time.split(' ')[1]}</small>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Iconify style={{ display: 'flex', marginLeft: '10px' }} icon="iconoir:plug-type-l" />

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant="h6">{translate('quizes.quiz_type')}</Typography>

            <small style={{ opacity: '0.7' }}>{getQuizTypeValue(data?.quiz_type)}</small>
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
          <strong>{translate('teachers.teacherId')} </strong>: <small>{data?.teacher_id} </small>{' '}
        </Typography>

        <Typography variant="subtitle1">
          <strong>{translate('teachers.teacher_full_name')} </strong>:{' '}
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

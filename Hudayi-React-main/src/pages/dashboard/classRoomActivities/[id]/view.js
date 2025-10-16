import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper,Typography ,Stack, Card  } from '@mui/material';
import { useRouter } from 'next/router';

// auth

// _mock_

// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';
// sections

import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

ClassRoomActivities.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ClassRoomActivities() {
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
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
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6">{translate('interviews.descripion')}</Typography>

      <Typography variant="h4">{data?.name}</Typography>


      <Stack spacing={1}>

      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.place')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.place}</small> </Typography>


      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.cost')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.cost}</small> </Typography>

      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.result')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.result}</small> </Typography>

      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.note')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.note}</small> </Typography>

      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.goal')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.activity_type?.goal}</small> </Typography>

      <Typography variant="subtitle1"><strong>{translate('classRoomActivity.activity_type_description')} </strong>: <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'30px'}}>{data?.activity_type?.description}</small> </Typography>


        
        {/* <Stack direction="row" alignItems="center" spacing={1}>
       <strong> {translate('classRoomActivity.place')}</strong>  : <small style={{'opacity':'0.7', fontSize:'16px', lineHeight:'25px'}}>{data?.place}</small>   بكلفة {data?.cost}   والنتيجة {data?.result} وكانت الملاحظة كالتالي:  {data?.result}. الهدف من هذه الفعالية هو {data?.activity_type?.goal}. {data?.activity_type?.description}
        </Stack> */}
      </Stack>

      


    

    </Stack>
  );

  const renderOverview = (
    <>
    <Stack  component={Card} spacing={3} sx={{ p: 3 }}>
    <Typography variant="h6">{translate('activities.start_datetime')}</Typography>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Iconify icon="solar:calendar-date-bold" />
      <small>{new Date(data?.start_datetime).toLocaleString()}</small>
    </Stack>
    <Typography variant="h6">{translate('activities.end_datetime')}</Typography>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Iconify icon="solar:calendar-date-bold" />
      <small>{new Date(data?.end_datetime).toLocaleString()}</small>
    </Stack>

    <Typography variant="h6">{translate('activities.activity_type')}</Typography>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Iconify icon="iconoir:plug-type-l" />
      <small>{data?.activity_type?.name}</small>
    </Stack>
  </Stack>

  </>
  );
 
  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3 }}
    >
      <Avatar
        alt={data?.name}
        src={data?.name}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <Stack spacing={1}>
      <Typography variant="h6">{translate('activities.teacherName')}</Typography>
        <Typography variant="body2">{data?.teacher?.user?.first_name} {data?.teacher?.user?.last_name}</Typography>
        
      </Stack>
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


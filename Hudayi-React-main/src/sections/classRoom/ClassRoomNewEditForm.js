import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider, AdapterMoment, LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';

import { useFormContext, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import moment from 'moment';

import { fData } from '../../utils/formatNumber';
import Label from '../../components/label';
import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get, postFormData, put } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFUploadAvatar,
} from '../../components/hook-form';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ClassRoomNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function ClassRoomNewEditForm({ isEdit, currentUser }) {
  const { push } = useRouter();
  const { translate } = useLocales();
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const getGrades = async (word) => {
    const grade = await get(`grades?search=${word}`);
    setGrades(grade?.data?.data || []);
  };
  const NewUserSchema = !isEdit
    ? Yup.object().shape({
        name: Yup.string().required(translate('students.required')),
        capacity: Yup.string().required(translate('students.required')),
        grade_id: Yup.string().required(translate('students.required')),
        teacher_id: Yup.string().required(translate('students.required')),
        // image: Yup.mixed().required(translate('students.required')),
      })
    : Yup.object().shape({
        name: Yup.string().required(translate('students.required')),
        capacity: Yup.string().required(translate('students.required')),
        grade_id: Yup.string().required(translate('students.required')),
        // image: Yup.mixed().required(translate('students.required')),
      });
  const {
    query: { id },
  } = useRouter();
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      capacity: currentUser?.capacity || '',
      grade_id: currentUser?.grade_id || null,
      teacher_id:
        currentUser?.class_room_teachers?.find((teacher) => teacher.left_at == null)?.teacher || {},
      students: currentUser?.class_room_students?.map((e) => e.student) || [],
      image:
        currentUser?.image == null
          ? null
          : `${imageLink}/${currentUser?.image}`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);

      const classRoom = await postFormData(
        isEdit ? `class-room/${id}` : 'class-room',
        { ...data, is_approved: '1' },
        data.image
      );

      if (classRoom.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.classRooms.root);
      } else if (classRoom.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar(translate('data_unique'), { variant: 'error' });
      } else {
        const error = classRoom.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }

      setIsLoading(false);

      if (classRoom.api === 'SUCCESS') {
        const teacher = currentUser?.class_room_teachers?.find(
          (teachers) => teachers.left_at == null
        );
        const teacher_id =
          typeof data.teacher_id === 'object' ? teacher.teacher.id : data.teacher_id;
        const class_room_teacher = isEdit
          ? await put(
              `class-room-teachers/${teacher_id}?class_room_id=${
                classRoom.data.id
              }&teacher_id=${teacher_id}&joined_at=${moment(new Date()).format(
                'YYYY-MM-DD'
              )}&left_at`
            )
          : await post('class-room-teachers', {
              id: null,
              class_room_id: parseInt(classRoom.data.id, 10),
              teacher_id: data.teacher_id,
              joined_at: moment(new Date()).format('YYYY-MM-DD'),
              left_at: null,
            });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`);
    setTeachers(teacher?.data?.data || []);
  };
  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`);
    setStudents(student?.data?.data || []);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label={translate('classRooms.name')} />
              <RHFTextField
                type="number"
                name="capacity"
                label={translate('classRooms.capacity')}
              />
              <RHFAutocomplete
                name="grade_id"
                label={translate('grades.grades')}
                onChange={(event, newValue) => setValue('grade_id', newValue?.id)}
                options={grades}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.name) {
                    return `${option.name} `;
                  }
                  if (isEdit && grades.length === 0) {
                    return `${currentUser?.grade?.name}`;
                  }
                  const foundGrades = grades.find((e) => e.id === option);
                  if (foundGrades && foundGrades?.name) {
                    return `${foundGrades?.name}`;
                  }

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getGrades(event.target.value);
                }}
              />
              {(currentUser?.class_room_teachers != null || !isEdit) && (
                <RHFAutocomplete
                  name="teacher_id"
                  key={`teacher_id_${currentUser}`}
                  label={translate('teachers.teacher')}
                  onChange={(event, newValue) => setValue('teacher_id', newValue?.id)}
                  options={teachers}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => {
                    if (option?.user?.first_name) {
                      return `${option?.user?.first_name} ${option?.user?.last_name} `;
                    }
                    if (isEdit && teachers.length === 0) {
                      return `${option?.user?.first_name} ${option?.user?.last_name}`;
                    }
                    const foundTeacher = teachers.find((e) => e.id === option);
                    if (foundTeacher && foundTeacher?.user?.first_name) {
                      return `${foundTeacher?.user.first_name} ${foundTeacher?.user.last_name}`;
                    }

                    return '';
                  }}
                  textFieldOnChange={(event) => {
                    getTeachers(event.target.value);
                  }}
                />
              )}
            </Box>

            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('classRooms.add') : translate('saveChanges')}
              </LoadingButton>

              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.classRooms.root);
                }}
                sx={{
                  marginLeft: 2,

                  backgroundColor: 'error.dark', // Set background color to error color
                  '&:hover': {
                    backgroundColor: '#8e0502', // Set the same background color on hover
                  },
                }}
              >
                {translate('cancel')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

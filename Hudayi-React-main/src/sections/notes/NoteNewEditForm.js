import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider, AdapterMoment, LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

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
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import moment from 'moment/moment';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get, put } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../components/hook-form';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

NoteNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function NoteNewEditForm({ isEdit, currentProduct }) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { translate } = useLocales();

    const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`);
    setTeachers(teacher?.data?.data || []);
  };

  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`);
    setStudents(student?.data?.data || []);
  };


  const getAdmins = async (word) => {
    const admin = await get(`admins?search=${word}`);
    setAdmins(admin?.data?.data || []);
  };

 
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    admin_id: Yup.string().required(translate('notes.admin_idRequied')),
    student_id: Yup.string().required(translate('notes.student_idRequied')),
    teacher_content: Yup.string().required(translate('notes.teacher_contentRequied')),
    teacher_id: Yup.string().required(translate('notes.teacher_idRequied')),
    admin_content: Yup.string().required(translate('notes.admin_contentRequied')),
    date: Yup.string().required(translate('notes.dateRequied')),
  });
 
  const defaultValues = useMemo(
    () => ({
      admin_id: currentProduct?.admin_id || null,
      student_id: currentProduct?.student_id || null,
      teacher_content: currentProduct?.teacher_content || '',
      teacher_id: currentProduct?.teacher_id || null,
      admin_content: currentProduct?.admin_content || '',
      date: new Date(currentProduct?.date) || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);
  const {
    query: { id },
  } = useRouter();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);

      const notes = isEdit
        ? await put(
            `notes/${id}?admin_id=${data.admin_id}&date=${data.date}&student_id=${data.student_id}&teacher_id=${data.teacher_id}&teacher_content=${data.teacher_content}&admin_content=${data.admin_content}`
          )
        : await post('notes', { id: null, ...data });

      if (notes.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.notes.root);
      } else if (notes.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar(translate("data_unique"), { variant: 'error' });
      } else {
        const error = notes.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }
      
      setIsLoading(false);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
     
        <Grid display="flex" container spacing={3}>
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
                   <RHFAutocomplete
                name="student_id"
                
                label={translate('students.students')}
                onChange={(event, newValue) => setValue('student_id', newValue?.id)}
                options={students}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && students.length === 0) {
                    return `${currentProduct?.student?.user?.first_name} ${currentProduct?.student?.user?.last_name}`;
                  } 
                    const foundStudents = students.find((e) => e.id === option);
                    if (foundStudents && foundStudents?.user?.first_name) {
                      return `${foundStudents?.user.first_name} ${foundStudents?.user.last_name}`;
                    }
                  

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getStudents(event.target.value);
                }}
              />

<RHFAutocomplete
                name="teacher_id"
                label={translate('teachers.teachers')}
                onChange={(event, newValue) => setValue('teacher_id', newValue?.id)}
                options={teachers}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && teachers.length === 0) {
                    return `${currentProduct?.teacher?.user?.first_name} ${currentProduct?.teacher?.user?.last_name}`;
                  } 
                    const foundTeacher = teachers.find((e) => e.id === option);
                    if (foundTeacher && foundTeacher?.teacher?.user?.first_name && foundTeacher?.teacher?.user?.last_name) {
                      return `${foundTeacher?.teacher?.user?.first_name} ${foundTeacher?.teacher?.user?.last_name}`;
                    }
                  

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getTeachers(event.target.value);
                }}
              />

<RHFAutocomplete
                name="admin_id"
                label={translate('admins.admins')}
                onChange={(event, newValue) => setValue('admin_id', newValue?.id)}
                options={admins}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && teachers.length === 0) {
                    return `${currentProduct?.user?.first_name}`;
                  } 
                    const foundAdmin = admins.find((e) => e.id === option);
                    if (foundAdmin && foundAdmin?.user) {
                      return `${foundAdmin?.user.first_name} ${foundAdmin?.user.first_name}`;
                    }
                 

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getAdmins(event.target.value);
                }}
              />


                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={translate('interviews.date')}
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />

                <RHFTextField
                  multiline
                  minRows="5"
                  name="teacher_content"
                  label={translate('notes.teacher_content')}
                />
                <RHFTextField
                  multiline
                  minRows="5"
                  name="admin_content"
                  label={translate('notes.admin_content')}
                />
              </Box>

              <Stack direction="row"  sx={{ mt: 3, justifyContent: 'flex-end'  }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('notes.add') : translate('saveChanges')}
                </LoadingButton>
                <Button
    variant="contained"
    onClick={() => {
      push(PATH_DASHBOARD.notes.root);
    }}
    sx={{
      marginLeft: 2,
    
      // Change text color to error color
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

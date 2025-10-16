import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider, AdapterMoment, LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';

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
  Button,
} from '@mui/material';
import { fData } from '../../utils/formatNumber';
import Label from '../../components/label';
import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get, postFormData, sqlTime } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFUpload,
  RHFUploadAvatar,
} from '../../components/hook-form';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

TeacherNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function TeacherNewForm({ isEdit, currentUser }) {
  const { push } = useRouter();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const [properties, setProperties] = useState([]);
  const getProperties = async () => {
    const proprty = await get('properties', null, enqueueSnackbar);
    setProperties(proprty.data?.data);
  };

  useEffect(() => {
    getProperties();
  }, []);

  const getShapeSchema = () => {
    const schema = {
      user__status: Yup.string().required(translate('students.required')),

      user__first_name: Yup.string().required(translate('students.required')),
      user__last_name: Yup.string().required(translate('students.required')),
      user__password: Yup.string().required(translate('students.required')),

      user__username: Yup.string().required(translate('students.required')),
      user__phone: Yup.string().required(translate('students.required')),
      user__gender: Yup.string().required(translate('students.required')),
      user__birth_place: Yup.string().required(translate('students.required')),
      user__father_name: Yup.string().required(translate('students.required')),
      user__mother_name: Yup.string().required(translate('students.required')),

      user__property_id: Yup.string().required(translate('students.required')),
    };
    const object = !isEdit
      ? { ...schema, user__password: Yup.string().required(translate('students.required')) }
      : schema;

    return object;
  };
  const NewUserSchema = Yup.object().shape(getShapeSchema());
  const defaultValues = useMemo(
    () => ({
      is_married: currentUser?.is_married || '',
      wives_count: currentUser?.wives_count || '',
      children_count: currentUser?.children_count || '',
      user__status: currentUser?.user?.status || '',
      user__email: currentUser?.user?.email || '',
      user__first_name: currentUser?.user?.first_name || '',
      user__last_name: currentUser?.user?.last_name || '',

      user__username: currentUser?.user?.username || '',
      user__password: currentUser?.user?.password || '',
      user__identity_number: currentUser?.user?.identity_number || '',
      user__phone: currentUser?.user?.phone || '',
      user__gender: currentUser?.user?.gender || '',

      user__birth_date: currentUser?.user?.birth_date
        ? new Date(currentUser?.user?.birth_date)
        : null,
      user__birth_place: currentUser?.user?.birth_place || '',
      user__father_name: currentUser?.user?.father_name || '',
      user__mother_name: currentUser?.user?.mother_name || '',
      user__qr_code: currentUser?.user?.qr_code || '',

      user__blood_type: currentUser?.user?.blood_type || '',
      user__note: currentUser?.user?.note || '',
      user__current_address: currentUser?.user?.current_address || '',
      user__is_has_disease: currentUser?.user?.is_has_disease || '',

      user__disease_name: currentUser?.user?.disease_name || '',
      user__is_has_treatment: currentUser?.user?.is_has_treatment || '',
      user__treatment_name: currentUser?.user?.treatment_name || '',
      user__are_there_disease_in_family: currentUser?.user?.are_there_disease_in_family || '',
      user__family_disease_note: currentUser?.user?.family_disease_note || '',
      user__property_id: currentUser?.user?.property_id || '',

      user__image:
        currentUser?.user?.image == null
          ? null
          : `${imageLink}/${currentUser?.user?.image}`,
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
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {
    query: { id },
  } = useRouter();
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
      const admin = await postFormData(
        isEdit ? `admins/${id}` : 'admins',
        {
          ...data,
          id: isEdit ? id : '',
          user_id: isEdit ? currentUser.user_id : '',
          user__id: isEdit ? currentUser.user.id : '',
          user__birth_date: sqlTime(data.user__birth_date),
          user__is_approved: '1',
          job_title_id: '',
          property_id: data?.user__property_id,
        },
        data.user__image
      );

      if (admin.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.users.adminRoot);
      } else {
        handleError(admin);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleError = (admin) => {
    const error = admin.hints.Error;
    if (error === 'Username already exists.') {
      enqueueSnackbar(translate('UsernameAlreadyExists'), { variant: 'error' });
    } else if (error === 'Email address is already in use.') {
      enqueueSnackbar(translate('EmailAddressIsAlreadyInUse'), { variant: 'error' });
    } else if (error === 'Identity number is already in use.') {
      enqueueSnackbar(translate('IdentityNumberIsAlreadyInUse'), { variant: 'error' });
    } else {
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('user__image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const [isPassowrodOn, setIsPassowrodOn] = useState(false);
  const handleFocus = () => {
    setIsPassowrodOn(true);
  };
  const handleBlur = () => {
    setIsPassowrodOn(false);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="user__image"
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
              <RHFTextField name="user__first_name" label={translate('students.first_name')} />

              <RHFTextField name="user__last_name" label={translate('students.last_name')} />
              <RHFTextField name="user__username" label={translate('students.username')} />

              <RHFSelect
                fullWidth
                name="user__gender"
                label={translate('students.gender')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: 'male', label: translate('students.male') },
                  { value: 'female', label: translate('students.female') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField type="email" name="user__email" label={translate('students.email')} />

              <RHFTextField
                type="password"
                name="user__password"
                onBlur={handleBlur}
                onFocus={handleFocus}
                label={
                  isEdit && !isPassowrodOn === true && getValues('user__password') === ''
                    ? '*********'
                    : translate('students.password')
                }
              />

              <RHFTextField type="number" name="user__phone" label={translate('students.phone')} />

              <RHFSelect
                fullWidth
                name="is_married"
                label={translate('teachers.is_married')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: '0', label: translate('teachers.notMarried') },
                  { value: '1', label: translate('teachers.married') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                type="number"
                name="wives_count"
                label={translate('teachers.wives_count')}
              />
              <RHFTextField name="children_count" label={translate('teachers.children_count')} />

              <RHFSelect
                fullWidth
                name="user__status"
                label={translate('students.status')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: 'فعال', label: translate('students.status_active') },
                  { value: 'غير فعال', label: translate('students.status_inctive') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                type="number"
                name="user__identity_number"
                label={translate('students.identity_number')}
              />
              {/* <RHFTextField type="tel" name="phone" label={translate('students.phone')} /> */}

              <RHFTextField name="user__birth_place" label={translate('students.birth_place')} />

              <RHFTextField name="user__father_name" label={translate('students.father_name')} />
              <RHFTextField name="user__mother_name" label={translate('students.mother_name')} />
              <RHFTextField name="user__qr_code" label={translate('students.qr_code')} />

              <RHFSelect
                fullWidth
                name="user__is_has_disease"
                label={translate('students.is_has_disease')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: '0', label: translate('students.no') },
                  { value: '1', label: translate('students.yes') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="user__disease_name" label={translate('students.disease_name')} />
              <RHFSelect
                fullWidth
                name="user__is_has_treatment"
                label={translate('students.is_has_treatment')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: '0', label: translate('students.no') },
                  { value: '1', label: translate('students.yes') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                name="user__treatment_name"
                label={translate('students.treatment_name')}
              />

              <RHFSelect
                fullWidth
                name="user__are_there_disease_in_family"
                label={translate('students.are_there_disease_in_family')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: '0', label: translate('students.no') },
                  { value: '1', label: translate('students.yes') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="user__property_id"
                label={translate('properties.name')}
                placeholder={translate('properties.name')}
              >
                <option value="" />
                {properties.map((property) => (
                  <option key={property?.id} value={property?.id}>
                    {property?.name}
                  </option>
                ))}
              </RHFSelect>

              <Controller
                name="user__birth_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={translate('students.birth_date')}
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
            </Box>

            <RHFTextField
              style={{ paddingTop: '30px' }}
              multiline
              rows="3"
              name="user__note"
              label={
                <span style={{ display: 'block', marginTop: '30px' }}>
                  {translate('students.note')}
                </span>
              }
            />
            <RHFTextField
              style={{ paddingTop: '30px' }}
              multiline
              rows="3"
              name="user__current_address"
              label={
                <span style={{ display: 'block', marginTop: '30px' }}>
                  {translate('students.current_address')}
                </span>
              }
            />

            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('admins.add') : translate('saveChanges')}
              </LoadingButton>
              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.users.adminRoot);
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

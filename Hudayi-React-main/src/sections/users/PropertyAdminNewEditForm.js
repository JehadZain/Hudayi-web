import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, TextField, Button } from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

PropertyAdminNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function PropertyAdminNewForm({ isEdit, currentProduct }) {
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const getProperties = async () => {
    const property = await get('properties', null, enqueueSnackbar);
    setProperties(property.data?.data);
  };
  useEffect(() => {
    getProperties();
  }, []);

  const getAdmin = async () => {
    try {
      const response = await get('admins/unassigned', null, enqueueSnackbar);
      if (response.api === 'NO_DATA' || response.data === null) {
        setAdmins([]); // Set the admins state to an empty array
      } else {
        setAdmins(response.data); // Set the admins state with the data from the API
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      // Handle the error here or set admins to an empty array if appropriate
      setAdmins([]);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);
  const { translate } = useLocales();

  const { push } = useRouter();

  const NewProductSchema = Yup.object().shape({
    admin_id: Yup.string().required(translate('students.required')),
    property_id: Yup.string().required(translate('students.required')),
  });

  const defaultValues = useMemo(
    () => ({
      admin_id: currentProduct?.admin_id || null,
      property_id: currentProduct?.property_id || null,
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

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const adminsPost = await post('property/admins', { id: null, ...data });

      if (adminsPost.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.users.adminRoot);
      } else {
        handleError(adminsPost);
      }
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFAutocomplete
                name="admin_id"
                native
                onChange={(event, newValue) => setValue('admin_id', newValue.id)}
                options={admins}
                label={translate('admins.admins')}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user) {
                    return `${option.user?.first_name} ${option.user?.last_name}`;
                  }

                  const admin = admins.find((e) => e.id === option)?.user;
                  if (admin) {
                    return `${admin?.first_name} ${admin?.last_name}`;
                  }

                  return '';
                }}
              />

              <RHFAutocomplete
                native
                name="property_id"
                InputLabelProps={{ shrink: true }}
                onChange={(event, newValue) => setValue('property_id', newValue.id)}
                options={properties}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  option?.name || properties.find((e) => e.id === option)?.name
                }
                renderInput={(params) => (
                  <TextField label={translate('properties.properties')} {...params} />
                )}
              />

              {/* <RHFAutocomplete
                name="property_id"
                onChange={(event, newValue) => setValue('property_id', newValue.id)}
                options={properties}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option?.name} `}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                      label={`${option?.name}`}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField label={translate('properties.name')} {...params} />
                )}
              /> */}

              {/* <RHFSelect
                native
                name="property_id"
                label={translate('branch_admins.branch_name')}
                placeholder={translate('branch_admins.branch_name')}
              >
                <option value="" />
                {properties.map((proprty) => (
                  <option key={proprty?.id} value={proprty?.id}>
                    {proprty?.name}
                  </option>
                ))}
              </RHFSelect> */}

              <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('property_admins.add') : translate('saveChanges')}
                </LoadingButton>

                <Button
                  variant="contained"
                  onClick={() => {
                    push(PATH_DASHBOARD.propertyAdmin.root);
                  }}
                  sx={{
                    marginLeft: 2,

                    backgroundColor: 'error.dark',
                    '&:hover': {
                      backgroundColor: '#8e0502',
                    },
                  }}
                >
                  {translate('cancel')}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

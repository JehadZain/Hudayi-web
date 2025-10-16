import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

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
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

import post, { get, put } from '../../utils/functions';

import { useLocales } from '../../locales';

// @mui
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

GradeNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function GradeNewEditForm({ isEdit, currentProduct }) {
  const { push } = useRouter();
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = useState(false);

  const [properties, setProperties] = useState([]);
  // const getProperties = async () => {
  //   const property = await get('properties');

  //   setProperties(property.data);
  // };
  // useEffect(() => {
  //   getProperties();
  // }, []);

  const getProperties = async (word) => {
    const property = await get(`properties?search=${word}`);
    setProperties(property?.data?.data || []);
  };
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('grades.nameRequied')),
    description: Yup.string().required(translate('grades.descRequied')),
    property_id: Yup.string().required(translate('grades.property_idRequied')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
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
  const {
    query: { id },
  } = useRouter();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);
      const grades = isEdit
        ? await put(
            `grades/${id}?name=${data.name}&description=${data.description}&property_id=${data.property_id}`
          )
        : await post('grades', { id: null, ...data });

      try {
        if (grades.api === 'SUCCESS') {
          reset();
          enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
          push(PATH_DASHBOARD.grades.root);
        } else if (grades.hints['0']?.includes('Duplicate')) {
          enqueueSnackbar(translate("data_unique"), { variant: 'error' });
        } else {
          const error = grades.hints['0'];
          enqueueSnackbar(error, { variant: 'error' });
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
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
                <RHFTextField name="name" label={translate('grades.name')} />

                
                <RHFAutocomplete
                name="property_id"
                label={translate('properties.properties')}
                onChange={(event, newValue) => setValue('property_id', newValue?.id)}
                options={properties}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.name) {
                    return `${option?.name}  `;
                  }
                  if (isEdit && properties.length === 0) {
                    return `${currentProduct?.name}`;
                  } 
                    const foundproperties = properties.find((e) => e.id === option);
                    if (foundproperties && foundproperties?.name) {
                      return `${foundproperties?.name}`;
                    }
                 

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getProperties(event.target.value);
                }}
              />
              
              </Box>

              <RHFTextField
                style={{ paddingTop: '30px' }}
                multiline
                rows="3"
                name="description"
                label={
                  <span style={{ display: 'block', marginTop: '30px' }}>
                    {translate('properties.description')}
                  </span>
                }
              />

              <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('grades.add') : translate('saveChanges')}
                </LoadingButton>

                <Button
                  variant="contained"
                  onClick={() => {
                    push(PATH_DASHBOARD.grades.root);
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

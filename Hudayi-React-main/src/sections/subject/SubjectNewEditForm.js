import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {  useEffect, useMemo, } from 'react';
import { AdapterMoment, LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography ,Button} from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get, put } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFTextField,
} from '../../components/hook-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

SubjectNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function SubjectNewEditForm({ isEdit, currentProduct }) {
  const { translate } = useLocales();

  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('subjects.nameRequied')),
    description: Yup.string().required(translate('subjects.descriptionRequied')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
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
      const notes = isEdit
        ? await put(`subjects/${id}?name=${data.name}&description=${data.description}`)
        : await post('subjects', { id: null, ...data });

      reset();
      enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
      push(PATH_DASHBOARD.subjects.root);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const files = values.images || [];

  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //   },

  // );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box rowGap={3} columnGap={2}>
              <RHFTextField name="name" label={translate('subjects.name')} />
              <RHFTextField
                multiline
                minRows="5"
                sx={{ mt: 3 }}
                name="description"
                label={translate('subjects.description')}
              />
            </Box>
            <Stack direction="row"  sx={{ mt: 3, justifyContent: 'flex-end'  }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('subjects.add') : translate('saveChanges')}
              </LoadingButton>

              <Button
    variant="contained"
    onClick={() => {
      push(PATH_DASHBOARD.subjects.root);
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

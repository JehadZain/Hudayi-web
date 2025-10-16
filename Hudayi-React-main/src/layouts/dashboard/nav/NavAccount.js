// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useLocales } from '../../../locales';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();
  const { translate } = useLocales();
  const getUsernameTranslation = (username) => {
    switch (username) {
      case 'org_admin':
        return translate('admins.org_admin_translation'); // Translate to 'مدير المنظمة'
      case 'branch_admin':
        return translate('admins.branch_admin_translation'); // Translate to 'مدير المركز'
      case 'property_admin':
        return translate('admins.property_admin_translation'); // Translate to 'مدير المنطقة'
      case 'student':
        return translate('طالب'); // Translate to 'طالب'
      case 'teacher':
        return translate('أستاذ'); // Translate to 'أستاذ'
      default:
        return username;
    }
  };

  return (
    <Link underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar
          src={`${imageLink}/${user?.image}`}
          alt={user?.first_name}
          name={user?.first_name}
        />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            <span> {user?.first_name}</span>
            <span> {user?.last_name}</span>
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {getUsernameTranslation(user?.username)}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}

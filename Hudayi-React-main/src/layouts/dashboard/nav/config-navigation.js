// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { useLocales } from '../../../locales';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const iconify = (name) => <Iconify icon={name} />;

const ICONS = {
  user: icon('ic_user'),

  dashboard: icon('ic_dashboard'),
  areas: iconify('mdi:map-marker'),
  branches: iconify('mdi:source-branch'),
  books: iconify('ic:twotone-menu-book'),
  grades: iconify('material-symbols:grade-outline-rounded'),
  classs: iconify('eos-icons:product-classes'),
  classMosque: iconify('icon-park-outline:circles-seven'),

  subjects: iconify('material-symbols:subject'),
  sessions: iconify('mdi:human-male-board'),
  analytics: iconify('material-symbols:analytics-outline'),
  interviews: iconify('guidance:meeting-room'),
  activities: iconify('material-symbols:auto-activity-zone-outline'),
  quizes: iconify('ic:outline-quiz'),
  notes: iconify('mdi:notes-outline'),
  quranQuizes: iconify('arcticons:al-quran-indonesia'),
};

export default function NavConfig() {
  const { user } = useAuthContext();
  const navConfig = [
    {
      subheader: '',
      items: [{ title: 'analytic', path: PATH_DASHBOARD.analytics.root, icon: ICONS.analytics }],
    },
  ];

  if (user.role !== 'teacher') {
    navConfig[0].items.push({
      title: 'users',
      path: PATH_DASHBOARD.users.root,
      icon: ICONS.user,

      children: [
        { title: 'student', path: PATH_DASHBOARD.users.studentRoot },
        { title: 'teacher', path: PATH_DASHBOARD.users.teacherRoot },
        {
          title: 'admin',
          path: PATH_DASHBOARD.users.adminRoot,
        },
      ],
    });
    navConfig[0].items.push({
      title: 'areas',
      path: PATH_DASHBOARD.area.root,
      icon: ICONS.areas,
    });
    navConfig[0].items.push({
      title: 'propertie',
      path: PATH_DASHBOARD.property.root,
      icon: ICONS.branches,
    });
    navConfig[0].items.push({
      title: 'book',
      path: PATH_DASHBOARD.books.root,
      icon: ICONS.books,
    });
    navConfig[0].items.push(
      {
        title: 'grade',
        path: PATH_DASHBOARD.grades.root,
        icon: ICONS.grades,
      },
      { title: 'class_room', path: PATH_DASHBOARD.classRooms.root, icon: ICONS.classs },
      {
        title: 'Mosque_ClassRooms',
        path: PATH_DASHBOARD.classRoomsMosque.root,
        icon: ICONS.classMosque,
      }
    );
    navConfig[0].items.push({
      title: 'subject',
      path: PATH_DASHBOARD.subjects.root,
      icon: ICONS.subjects,
    });
  }

  navConfig[0].items.push(
    { title: 'session', path: PATH_DASHBOARD.sessions.root, icon: ICONS.sessions },
    { title: 'interview', path: PATH_DASHBOARD.interviews.root, icon: ICONS.interviews },
    { title: 'activitie', path: PATH_DASHBOARD.activities.root, icon: ICONS.activities },
    { title: 'quize', path: PATH_DASHBOARD.quizes.root, icon: ICONS.notes },
    { title: 'note', path: PATH_DASHBOARD.notes.root, icon: ICONS.quizes },
    { title: 'quran_quize', path: PATH_DASHBOARD.quranQuizes.root, icon: ICONS.quranQuizes }
  );

  return navConfig;
}

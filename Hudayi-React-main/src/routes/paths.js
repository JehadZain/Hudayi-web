// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  analytics: {
    root: path(ROOTS_DASHBOARD, '/analytics'),
  },

  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/area/${id}/modifiye/`),

    view: (id) => path(ROOTS_DASHBOARD, `/area/${id}/view/`),
  },
  property: {
    root: path(ROOTS_DASHBOARD, '/property'),
    view: (id) => path(ROOTS_DASHBOARD, `/property/${id}/view/`),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/property/${id}/modifiye/`),
  },

  books: {
    root: path(ROOTS_DASHBOARD, '/books'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/books/${id}/modifiye/`),

    view: (id) => path(ROOTS_DASHBOARD, `/books/${id}/view/`),
  },

  classRooms: {
    root: path(ROOTS_DASHBOARD, '/classRooms'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/classRooms/${id}/modifiye/`),
    view: (id) => path(ROOTS_DASHBOARD, `/classRooms/${id}/view/`),
  },

  classRoomsMosque: {
    root: path(ROOTS_DASHBOARD, '/classRoomsMosque'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/classRoomsMosque/${id}/modifiye/`),
    view: (id) => path(ROOTS_DASHBOARD, `/classRoomsMosque/${id}/view/`),
  },

  sessions: {
    root: path(ROOTS_DASHBOARD, '/sessions'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/sessions/${id}/modifiye/`),

    view: (id) => path(ROOTS_DASHBOARD, `/sessions/${id}/view/`),
  },

  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
    studentRoot: path(ROOTS_DASHBOARD, '/users/students'),
    studentModifiye: (id) => path(ROOTS_DASHBOARD, `/users/students/${id}/modifiye/`),

    studentView: (id) => path(ROOTS_DASHBOARD, `/users/students/${id}/view/`),
    teacherRoot: path(ROOTS_DASHBOARD, '/users/teachers'),
    teacherModifiye: (id) => path(ROOTS_DASHBOARD, `/users/teachers/${id}/modifiye/`),
    teacherView: (id) => path(ROOTS_DASHBOARD, `/users/teachers/${id}/view/`),
    adminRoot: path(ROOTS_DASHBOARD, '/users/admins'),
    adminModifiye: (id) => path(ROOTS_DASHBOARD, `/users/admins/${id}/modifiye/`),
    adminView: (id) => path(ROOTS_DASHBOARD, `/users/admins/${id}/view/`),
  },

  subjects: {
    root: path(ROOTS_DASHBOARD, '/subjects'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/subjects/${id}/modifiye/`),
    view: (id) => path(ROOTS_DASHBOARD, `/subjects/${id}/view/`),
  },

  grades: {
    root: path(ROOTS_DASHBOARD, '/grades'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/grades/${id}/modifiye/`),

    view: (id) => path(ROOTS_DASHBOARD, `/grades/${id}/view/`),
  },

  orgAdmins: {
    root: path(ROOTS_DASHBOARD, '/users/admins/orgAdmins'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/users/admins/orgAdmins/${id}/modifiye/`),

    // modifiye: path(ROOTS_DASHBOARD, '/users/admins/orgAdmins/modifiye'),
    view: (id) => path(ROOTS_DASHBOARD, `/users/admins/orgAdmins/${id}/view/`),
  },
  branchsAdmin: {
    root: path(ROOTS_DASHBOARD, '/users/admins/branchesAdmin'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/users/admins/branchesAdmin/${id}/modifiye/`),

    // modifiye: path(ROOTS_DASHBOARD, '/users/admins/branchesAdmin/modifiye'),
    view: (id) => path(ROOTS_DASHBOARD, `/users/admins/branchesAdmin/${id}/view/`),
  },

  propertyAdmin: {
    root: path(ROOTS_DASHBOARD, '/users/admins/propertyAdmin'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/users/admins/propertyAdmin/${id}/modifiye/`),

    // modifiye: path(ROOTS_DASHBOARD, '/users/admins/propertyAdmin/modifiye'),
    view: (id) => path(ROOTS_DASHBOARD, `/users/admins/propertyAdmin/${id}/view/`),
  },

  mosques: {
    root: path(ROOTS_DASHBOARD, '/property/mosques'),
    modifiye: path(ROOTS_DASHBOARD, '/property/mosques/modifiye'),
    view: (id) => path(ROOTS_DASHBOARD, `/property/mosques/${id}/view/`),
  },

  schools: {
    root: path(ROOTS_DASHBOARD, '/property/schools'),
    modifiye: path(ROOTS_DASHBOARD, '/property/schools/modifiye'),
    view: (id) => path(ROOTS_DASHBOARD, `/property/schools/${id}/view/`),
  },

  interviews: {
    root: path(ROOTS_DASHBOARD, '/interviews'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/interviews/${id}/modifiye/`),

    interviewDetails: (id) => path(ROOTS_DASHBOARD, `/interviews/${id}/interviewDetails/`),
  },

  notes: {
    root: path(ROOTS_DASHBOARD, '/notes'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/notes/${id}/modifiye/`),

    noteDetails: (id) => path(ROOTS_DASHBOARD, `/notes/${id}/noteDetails/`),
  },

  quizes: {
    root: path(ROOTS_DASHBOARD, '/quizes'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/quizes/${id}/modifiye/`),

    quizDetails: (id) => path(ROOTS_DASHBOARD, `/quizes/${id}/quizDetails/`),
  },

  quranQuizes: {
    root: path(ROOTS_DASHBOARD, '/quranQuizes'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/quranQuizes/${id}/modifiye/`),
    quranQuizeDetails: (id) => path(ROOTS_DASHBOARD, `/quranQuizes/${id}/quranQuizeDetails/`),
  },
  activities: {
    root: path(ROOTS_DASHBOARD, '/activities'),
    modifiye: (id) => path(ROOTS_DASHBOARD, `/activities/${id}/modifiye/`),

    activityDetails: (id) => path(ROOTS_DASHBOARD, `/activities/${id}/activityDetails/`),
  },

  classRoomActivities: {
    view: (id) => path(ROOTS_DASHBOARD, `/classRoomActivities/${id}/view/`),
  },
};

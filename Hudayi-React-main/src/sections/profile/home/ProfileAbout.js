import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import { property } from 'lodash';

import Iconify from '../../../components/iconify';
 

import { useLocales } from '../../../locales';




// ----------------------------------------------------------------------

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------
const iconify = (name) => <Iconify icon={name} />;

const ICONS = {
   
    
   
  
  id: iconify('mdi:id-card-outline'),
  first_name: iconify('wpf:name'),
  identity_number:iconify("mdi:subscriber-identity-module-outline"),
  email:iconify('mdi:email'),
  phone: iconify('ic:outline-phone'),
  birth:iconify('clarity:date-line'),
  location:iconify('mdi:location'),
  status:iconify('fluent:status-12-regular'),
  name :iconify('mdi:building'),
  capacity:iconify('grommet-icons:capacity'),
  branch:iconify('carbon:branch'),
  property_type:iconify('material-symbols:merge-type'),
  description:iconify('material-symbols:description'),
  class_room_name:iconify('icon-park:classroom'),
  sessionName: iconify('simple-icons:sessionize'),
  date: iconify('clarity:date-line'),
  time: iconify('ri:time-line'),
  duration: iconify('game-icons:duration'),
  subject: iconify('material-symbols:subject'),
  place: iconify('ep:place'),
  type:iconify('ic:baseline-merge-type'),
gender:iconify('icons8:gender'),
father_name:iconify('icons8:user-male'),
mother_name:iconify('cil:user-female'),
blood_type:iconify('material-symbols:bloodtype-outline'),
current_address:iconify('fluent-mdl2:input-address'),
is_has_disease:iconify('solar:virus-bold-duotone'),
is_has_treatment:iconify('healthicons:water-treatment'),
username:iconify("mdi:rename"),
note:iconify("ph:note-thin"),
is_married:iconify("fluent-mdl2:sync-status"),
wives_count:iconify("mdi:women"),
children_count:iconify("fa6-solid:children"),
};
ProfileAbout.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  father_name: PropTypes.string,
  username: PropTypes.string,
  birth_date: PropTypes.string,
  birth_place: PropTypes.string,
  status:PropTypes.string,
  property_type:PropTypes.string,
  capacity:PropTypes.string,
  branch_id:PropTypes.string,
  description:PropTypes.string,
  gradeId:PropTypes.string,
  areaId:PropTypes.string,
  property_id:PropTypes.string,
  class_room_name:PropTypes.string,
  class_room_id:PropTypes.string,
  admin_id:PropTypes.string,
  branch_name:PropTypes.string,
  organization:PropTypes.string,
  property_name:PropTypes.string,
  mosque_id:PropTypes.string,
  organization_id:PropTypes.string,
  school_id:PropTypes.string,
  subjectId:PropTypes.string,
  studentId:PropTypes.string,
  id:PropTypes.string,
  name:PropTypes.string,
  sessionId:PropTypes.string,
  sessionName:PropTypes.string,
  date:PropTypes.string,
  start_at:PropTypes.string,
  duration:PropTypes.string,
  subject_name:PropTypes.string,
  place:PropTypes.string,
  gradename:PropTypes.string,
  type:PropTypes.string,
  identity_number:PropTypes.string,
  gender:PropTypes.string,
  mother_name:PropTypes.string,
  blood_type:PropTypes.string,
  current_address:PropTypes.string,
  is_has_disease:PropTypes.string,
  disease_name:PropTypes.string,
  is_has_treatment:PropTypes.string,
  treatment_name:PropTypes.string,
  teacherId:PropTypes.string,
  note:PropTypes.string,
  is_married:PropTypes.string,
  wives_count:PropTypes.string,
  are_there_disease_in_family:PropTypes.string,
  children_count:PropTypes.string,
  teacherName:PropTypes.string,
};


           
export default function ProfileAbout({teacherName,are_there_disease_in_family,children_count,wives_count,is_married,note,teacherId,treatment_name,is_has_treatment,disease_name,is_has_disease,current_address,blood_type ,mother_name,gender, identity_number, id,name,gradename,type, first_name, last_name, email, phone, father_name, username ,birth_date ,birth_place,status,property_type,capacity,branch_id,description,gradeId,areaId,property_id,class_room_name,class_room_id,admin_id,branch_name,organization,property_name,mosque_id,school_id,subjectId,studentId,sessionId,sessionName,organization_id,date,start_at,duration,subject_name,place}){
  const { translate } = useLocales();
  function translatePropertyType(propertyType) {
    switch (propertyType) {
      case 'mosque':
        return translate('properties.mosque_translation');
      case 'school':
        return translate('properties.school_translation');
      default:
        return propertyType;
    }
  }
  
  let content;
  if (are_there_disease_in_family === "لا" || are_there_disease_in_family === "0") {
    content = translate('noFamilyDiseas');
  } else if (are_there_disease_in_family === "1" || are_there_disease_in_family === "نعم") {
    content = translate('FamilyDiseas');
  } else {
    content = '';
  }

  let contentGender;
  if (gender === "male" || gender === "0") {
    contentGender = translate('students.male');
  } else if (gender === "female" || gender === "1") {
    contentGender = translate('students.female');
  } else {
    contentGender = '';
  }


  let contentMaritalStatus;
if (is_married === "0" || is_married === null || is_married === "لا") {
  contentMaritalStatus = translate('teachers.unmarried');
} else if (is_married === "1" || is_married === "نعم") {
  contentMaritalStatus = translate('teachers.married');
} else {
  contentMaritalStatus = '';
}



  let contentTreatment;
if (is_has_treatment === "لا" || is_has_treatment === "0") {
  contentTreatment = translate('no_treatment');
} else if (is_has_treatment === "1" || is_has_treatment === "نعم") {
  contentTreatment = "يوجد";
} else {
  contentTreatment = '';
}


let contentDisease;
if (is_has_disease === "لا" || is_has_disease === "0") {
  contentDisease = translate('no_disease');
} else if (is_has_disease === "1" || is_has_disease === "نعم") {
  contentDisease = "يوجد";
} else {
  contentDisease = '';
}

  return (
       
    <Card>
    {/* <CardHeader style={{ marginTop: '30px' }} title={translate('students.information')} /> */}
    <Stack spacing={2} sx={{ p: 3 }}>

      
    {studentId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('students.studentId')}</strong> :   {studentId}
            </span>
          </Typography>
        </Stack>
      )}

{teacherId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('teachers.teacherId')}</strong> :   {teacherId}
            </span>
          </Typography>
        </Stack>
      )}

{teacherName && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.first_name}</strong>
            <span color="text.primary">
            <strong>{translate('teachers.teacher_full_name')}</strong> :   {teacherName} 
            </span>
          </Typography>
        </Stack>
      )}

    {name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.name}</strong>
            <span color="text.primary">
            <strong>{translate('properties.name')}</strong> :   {name}
            </span>
          </Typography>
        </Stack>
      )}


{gradename && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.name}</strong>
            <span color="text.primary">
            <strong>{translate('grades.name')}</strong> :   {gradename}
            </span>
          </Typography>
        </Stack>
      )}

{organization_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('org_admins.organizationId')}</strong> :   {organization_id}
            </span>
          </Typography>
        </Stack>
      )}
{sessionId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.sessionId')}</strong> :   {sessionId}
            </span>
          </Typography>
        </Stack>
      )}
      
{sessionName && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.sessionName}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.name')}</strong> :   {sessionName}
            </span>
          </Typography>
        </Stack>
      )}





{date && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.date}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.date')}</strong> :   {date}
            </span>
          </Typography>
        </Stack>
      )}


{start_at && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.time}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.start_at')}</strong> :   {start_at}
            </span>
          </Typography>
        </Stack>
      )}


{duration && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.duration}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.duration')}</strong> :   {duration}
            </span>
          </Typography>
        </Stack>
      )}

{subjectId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('subjects.subjectId')}</strong> :   {subjectId}
            </span>
          </Typography>
        </Stack>
      )}
    
{subject_name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.subject}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.subject_name')}</strong> :   {subject_name}
            </span>
          </Typography>
        </Stack>
      )}
{type && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.type}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.type')}</strong> :   {type}
            </span>
          </Typography>
        </Stack>
      )}

{place && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.place}</strong>
            <span color="text.primary">
            <strong>{translate('sessions.place')}</strong> :   {place}
            </span>
          </Typography>
        </Stack>
      )}



    {branch_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.branch}</strong>
            <span color="text.primary">
            <strong>{translate('properties.branch_id')}</strong> :   {branch_id}
            </span>
          </Typography>
        </Stack>
      )}
      
      {mosque_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('mosques.mosques_id')}</strong> :  {mosque_id}
            </span>
          </Typography>
        </Stack>
      )}  

{school_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('schools.school_id')}</strong> :  {school_id}
            </span>
          </Typography>
        </Stack>
      )}  
      {first_name && (
        <Stack direction="row" style={{ marginTop: '10px' }}>
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.first_name}</strong>
            <span color="text.primary">
            <strong>{translate('admins.first_name')}</strong>   :  {first_name} {last_name}
            </span>
          </Typography>
        </Stack>
      )}
      


  
      {username && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.username}</strong>
            <span color="text.primary">
            <strong>{translate('students.username')}</strong> :  {username}
            </span>
          </Typography>
        </Stack>
      )}

{identity_number && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.identity_number}</strong>
            <span color="text.primary">
            <strong>{translate('students.identity_number')}</strong> :   {identity_number}
            </span>
          </Typography>
        </Stack>
      )}
    {is_married && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.is_married}
      </strong>
      <span color="text.primary">
        <strong> {translate('teachers.marital_statue')}</strong> : {contentMaritalStatus}
      </span>
    </Typography>
  </Stack>
)}

{is_married !== "0" && wives_count  && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.wives_count}
      </strong>
      <span color="text.primary">
        <strong>{translate('teachers.wives_count')}</strong> : {wives_count}
      </span>
    </Typography>
  </Stack>
)}

{is_married !== "0" &&  children_count  &&(
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.children_count}
      </strong>
      <span color="text.primary">
        <strong>{translate('teachers.children_count')}</strong> : {children_count}
      </span>
    </Typography>
  </Stack>
)}


 {phone && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.phone}</strong>
            <span color="text.primary">
            <strong>{translate('students.phone')}</strong> :  {phone}
            </span>
          </Typography>
        </Stack>
      )}
{gender !== undefined && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.gender}
      </strong>
      <span color="text.primary">
        <strong>{translate('students.gender')}</strong> : {contentGender}
      </span>
    </Typography>
  </Stack>
)}

{father_name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.father_name}</strong>
            <span color="text.primary">
          <strong>{translate('students.father_name')}</strong>   : {father_name}
            </span>
          </Typography>
        </Stack>
      )}



{mother_name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.mother_name}</strong>
            <span color="text.primary">
          <strong>{translate('students.mother_name')}</strong>   : {mother_name}
            </span>
          </Typography>
        </Stack>
      )}

{blood_type && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.blood_type}</strong>
            <span color="text.primary">
          <strong>{translate('students.blood_type')}</strong>   : {blood_type}
            </span>
          </Typography>
        </Stack>
      )}


{is_has_disease && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.is_has_disease}
      </strong>
      <span color="text.primary">
        <strong>{translate('students.is_has_disease')}</strong> : {contentDisease}
      </span>
    </Typography>
  </Stack>
)}

{is_has_disease !== "0" && disease_name  &&(
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.is_has_disease}</strong>
            <span color="text.primary">
          <strong>{translate('students.disease_name')}</strong>   : {disease_name}
            </span>
          </Typography>
        </Stack>
      )}

{is_has_treatment && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
        {ICONS.is_has_treatment}
      </strong>
      <span color="text.primary">
        <strong>{translate('students.is_has_treatment')}</strong> : {contentTreatment}
      </span>
    </Typography>
  </Stack>
)}



{is_has_treatment !== "0" &&  treatment_name  &&(
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.is_has_disease}</strong>
            <span color="text.primary">
          <strong>{translate('students.treatment_name')}</strong>   : {treatment_name}
            </span>
          </Typography>
        </Stack>
      )}
{is_has_disease && (

<Stack direction="row">
  <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
    <strong style={{ display: 'inline', marginLeft: '5px', marginRight: '5px' }}>
      {ICONS.is_has_disease}
    </strong>
    <span color="text.primary">
      <strong>{translate('teachers.is_has_treatment')}</strong> : {content}
    </span>
  </Typography>
</Stack>
  )}
{note && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.note}</strong>
            <span color="text.primary">
          <strong>{translate('note')}</strong>   : {note}
            </span>
          </Typography>
        </Stack>
      )}


{admin_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
          <strong>{translate('admins.AdminId')}</strong>   : {admin_id}
            </span>
          </Typography>
        </Stack>
      )}

      

{branch_name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.branch}</strong>
            <span color="text.primary">
            <strong>{translate('branch_admins.branch_name')}</strong> :  {branch_name}
            </span>
          </Typography>
        </Stack>
      )}

{property_name && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.branch}</strong>
            <span color="text.primary">
            <strong>{translate('property_admins.property_name')}</strong> :  {property_name}
            </span>
          </Typography>
        </Stack>
      )}

{organization && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.branch}</strong>
            <span color="text.primary">
            <strong>{translate('org_admins.name')}</strong> :  {organization}
            </span>
          </Typography>
        </Stack>
      )}


{class_room_id && (
      <Stack direction="row">
      <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
        <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
        <span color="text.primary">
        <strong>{translate('classRooms.classRoomId')}</strong> :  {class_room_id}
        </span>
      </Typography>
    </Stack>
      )}   

{class_room_name && (
      <Stack direction="row">
      <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
        <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.class_room_name}</strong>
        <span color="text.primary">
        <strong>{translate('classRooms.name')}</strong> :  {class_room_name}
        </span>
      </Typography>
    </Stack>
      )}

{property_type && (
  <Stack direction="row">
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
      <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.property_type}</strong>
      <span color="text.primary">
        <strong>{translate('properties.property_type')}</strong> :   {translatePropertyType(property_type)}
      </span>
    </Typography>
  </Stack>
)}

{gradeId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('grades.gradesId')}</strong> :  {gradeId}
            </span>
          </Typography>
        </Stack>
      )}
{capacity && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.capacity}</strong>
            <span color="text.primary">
            <strong>{translate('properties.capacity')}</strong> :  {capacity}
            </span>
          </Typography>
        </Stack>
      )}


  

  {description && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.description}</strong>
            <span color="text.primary">
          <strong>{translate('properties.description')}</strong> :   {description}
            </span>
          </Typography>
        </Stack>
      )}



      

{areaId && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('area.areaId')}</strong> :  {areaId}
            </span>
          </Typography>
        </Stack>
      )}  

{property_id && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.id}</strong>
            <span color="text.primary">
            <strong>{translate('properties.propertyId')}</strong> :  {id}
            </span>
          </Typography>
        </Stack>
      )}
    
  
     
  
      {email && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.email}</strong>
            <span color="text.primary">
            <strong>{translate('students.email')}</strong> :  {email}
            </span>
          </Typography>
        </Stack>
      )}
  
     
  
      {birth_date && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.birth}</strong>
            <span color="text.primary">
            <strong>{translate('students.birth_date')}</strong> :  {birth_date}
            </span>
          </Typography>
        </Stack>
      )}
  
      {birth_place && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.location}</strong>
            <span color="text.primary">
            <strong>{translate('students.birth_place')}</strong> :  {birth_place}
            </span>
          </Typography>
        </Stack>
      )}


      {current_address && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px' }}>{ICONS.current_address}</strong>
            <span color="text.primary">
          <strong>{translate('students.current_address')}</strong>   : {current_address}
            </span>
          </Typography>
        </Stack>
      )}

  
      {status && (
        <Stack direction="row">
          <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
            <strong style={{ display: 'inline', marginLeft: '5px', marginRight:'5px'  }}>{ICONS.status}</strong>
            <span color="text.primary">
            <strong>{translate('students.status')}</strong> :  {status === "1"?translate('students.status_active'):translate('students.status_inctive')}
            </span>
          </Typography>
        </Stack>
      )}
    </Stack>
  </Card>
 
  
  );
}

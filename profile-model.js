const OFFERGET_SCHEMA_VERSION = 2;

function offergetHasContent(entry) {
  return Boolean(entry) && typeof entry === 'object' && Object.values(entry).some((value) => String(value ?? '').trim() !== '');
}

function offergetToArray(value) {
  if (Array.isArray(value)) return value.filter(offergetHasContent);
  return offergetHasContent(value) ? [value] : [];
}

function offergetRename(entry, renames) {
  const result = {};
  Object.entries(entry).forEach(([key, value]) => { result[renames[key] || key] = value; });
  return result;
}

function migrateProfile(profile) {
  if (!profile || typeof profile !== 'object') return {};
  if (profile.schemaVersion >= OFFERGET_SCHEMA_VERSION) return profile;

  const next = structuredClone(profile);
  const basics = next.basics || {};
  const skills = next.skills || {};
  const additional = next.additional || {};
  const preferences = next.preferences || {};

  next.education = offergetToArray(next.education);
  next.internships = [...offergetToArray(next.experience), ...offergetToArray(next.internship)];
  next.campus = offergetToArray(next.campus).map((entry) => offergetRename(entry, { name: 'organization' }));
  next.projects = offergetToArray(next.projects).map((entry) => offergetRename(entry, {
    role: 'projectRole',
    description: 'projectDescription',
    duty: 'projectDuty',
    link: 'projectLink'
  }));
  next.honors = typeof next.honors === 'string'
    ? (next.honors.trim() ? [{ honorName: next.honors }] : [])
    : offergetToArray(next.honors).map((entry) => offergetRename(entry, { name: 'honorName' }));
  next.certificates = typeof next.certificates === 'string'
    ? (next.certificates.trim() ? [{ certificateName: next.certificates }] : [])
    : offergetToArray(next.certificates);
  next.publications = typeof next.publications === 'string'
    ? (next.publications.trim() ? [{ publicationTitle: next.publications }] : [])
    : offergetToArray(next.publications);
  next.volunteer = offergetToArray(next.volunteer);

  next.languages = (skills.languages || skills.languageScore || skills.languageProficiency)
    ? [{ languageName: skills.languages || '', languageLevel: skills.languageProficiency || '', languageScore: skills.languageScore || '' }]
    : [];
  next.skills = { technical: skills.technical || '', tools: skills.tools || '', soft: skills.soft || '' };

  next.links = { portfolio: basics.portfolio || '', works: '', blog: '' };
  next.basics = { ...basics };
  delete next.basics.portfolio;
  next.summary = { selfIntroduction: additional.summary || '', careerObjective: '' };
  next.additional = { references: additional.references || '', other: additional.other || '' };
  next.preferences = {
    salary: preferences.salary || '',
    workAuthorization: preferences.workAuthorization || '',
    availability: preferences.availability || '',
    jobType: preferences.type || '',
    preferredLocation: preferences.location || ''
  };
  next.gaming = Array.isArray(next.gaming) ? next.gaming : [];

  delete next.experience;
  delete next.internship;
  next.schemaVersion = OFFERGET_SCHEMA_VERSION;
  return next;
}
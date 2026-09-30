const FIELD_ALIASES = {
  fullName: ['姓名', '真实姓名', 'name', 'full name', 'fullname'],
  surnamePinyin: ['姓全拼', '姓拼音', 'surname pinyin'],
  givenNamePinyin: ['名全拼', '名拼音', 'given name pinyin'],
  email: ['邮箱', '电子邮箱', 'email', 'e-mail'],
  phone: ['手机', '手机号', '电话', 'mobile', 'phone', 'tel'],
  birthday: ['出生日期', '生日', 'birthday', 'date of birth'],
  gender: ['性别', 'gender'],
  nationality: ['国籍', 'nationality'],
  location: ['所在城市', '城市', '居住地', 'location', 'city'],
  hometown: ['籍贯', 'hometown', 'native place'],
  im: ['im（微信/qq）', '微信', 'qq', '即时通讯'],
  website: ['个人网站', '网站', 'portfolio', 'website', '个人主页'],
  linkedin: ['linkedin'],
  github: ['github'],
  school: ['学校', '院校', '大学', 'school', 'university'],
  schoolLocation: ['学校所在地', 'school location'],
  degree: ['学历', 'degree'],
  college: ['学院名称', '学院', 'college'],
  major: ['专业', 'major', 'field of study'],
  studyMode: ['学习形式', 'study mode'],
  gpa: ['gpa', '成绩', '绩点'],
  company: ['公司', '雇主', 'company', 'employer'],
  title: ['职位', '职称', 'title', 'job title'],
  startDate: ['开始时间', '入职时间', 'start date', 'from'],
  endDate: ['结束时间', '离职时间', 'end date', 'to'],
  description: ['工作描述', '职责', 'description', 'responsibilities'],
  projectName: ['项目名称', 'project name'],
  projectRole: ['职务', '项目角色', 'project role'],
  projectDescription: ['项目描述', 'project description'],
  projectDuty: ['项目职责', 'project duty', 'project responsibility'],
  honors: ['获奖经历', '荣誉', '奖项', '获奖', 'honor', 'award'],
  certificates: ['证书', '资格证', 'certificate', 'certification'],
  languageScore: ['相关证书等级/分数', '语言成绩', 'language score'],
  languageProficiency: ['精通程度', '语言熟练程度', 'language proficiency'],
  gameName: ['游戏名称', 'game name'],
  gameDetails: ['游玩程度', '游戏进度', 'game progress'],
  selfDescription: ['自我描述', '自我介绍', 'self description'],
  salary: ['期望薪资', '薪资', 'salary'],
  workAuthorization: ['工作许可', 'work authorization'],
  availability: ['到岗时间', '可入职时间', 'availability'],
  currentAnnual: ['当前年薪', 'current annual salary'],
  currentMonthly: ['当前月薪', 'current monthly salary'],
  salaryMonths: ['发薪月数', 'salary months'],
  expectedAnnual: ['期望年薪', 'expected annual salary']
};

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[\s_*:：()（）\[\]【】]/g, '');
}

function getLabelText(field) {
  const label = field.labels?.[0] || field.closest('label');
  const nearby = field.closest('div, section, li, td')?.innerText?.slice(0, 160);
  return normalize(`${label?.innerText || ''} ${field.name || ''} ${field.id || ''} ${field.placeholder || ''} ${field.getAttribute('aria-label') || ''} ${nearby || ''}`);
}

function findProfileKey(field) {
  const text = getLabelText(field);
  return Object.entries(FIELD_ALIASES).find(([, aliases]) => aliases.some((alias) => text.includes(normalize(alias))))?.[0];
}

function flattenProfile(profile) {
  return Object.values(profile).reduce((all, group) => ({ ...all, ...group }), {});
}

function setFieldValue(field, value) {
  const setter = Object.getOwnPropertyDescriptor(field.constructor.prototype, 'value')?.set;
  if (setter) setter.call(field, value);
  else field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
}

async function fillForm() {
  const { profile } = await chrome.storage.local.get('profile');
  if (!profile) return { filled: 0, total: 0 };
  const values = flattenProfile(profile);
  const fields = [...document.querySelectorAll('input, textarea, select')].filter((field) => !field.disabled && field.type !== 'hidden' && field.type !== 'file');
  let filled = 0;
  fields.forEach((field) => {
    const key = findProfileKey(field);
    if (key && values[key] !== undefined && values[key] !== '') {
      setFieldValue(field, values[key]);
      filled += 1;
    }
  });
  return { filled, total: fields.length };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'fill-form') {
    fillForm().then(sendResponse);
    return true;
  }
});

const FIELD_ALIASES = {
  fullName: ['姓名', '真实姓名', 'full name', 'fullname'],
  englishName: ['英文名', 'english name'],
  surnamePinyin: ['姓全拼', '姓拼音', 'surname pinyin'],
  givenNamePinyin: ['名全拼', '名拼音', 'given name pinyin'],
  phone: ['手机号码', '手机号', '手机', '联系电话', '联系方式', '电话', 'mobile', 'phone', 'tel'],
  email: ['电子邮箱', '邮箱', 'email', 'e-mail'],
  birthday: ['出生日期', '出生年月', '生日', 'birthday', 'date of birth'],
  gender: ['性别', 'gender'],
  nationality: ['国籍', 'nationality'],
  location: ['所在城市', '现居城市', '居住城市', '居住地', '城市', 'location', 'city'],
  hometown: ['籍贯', 'hometown', 'native place'],
  imType: ['im类型'],
  im: ['im（微信/qq）', '即时通讯', '微信', 'qq'],
  website: ['个人网站', '个人主页', 'website', 'homepage'],
  github: ['github'],
  linkedin: ['linkedin', '领英'],

  school: ['毕业院校', '学校名称', '学校', '院校', 'university', 'school'],
  schoolLocation: ['学校所在地', 'school location'],
  degree: ['学历', '学位', 'degree'],
  college: ['学院名称', '学院', 'college', 'faculty'],
  major: ['专业名称', '专业', 'major', 'field of study'],
  studyMode: ['学习形式', '培养方式', 'study mode'],
  gpa: ['gpa', '绩点', '平均分', '成绩'],

  company: ['公司名称', '公司', '单位名称', '单位', '雇主', 'company', 'employer'],
  title: ['职位名称', '职位', '职称', '岗位', 'job title', 'position', 'title'],
  workLocation: ['工作地点', 'work location'],
  industry: ['所属行业', '行业', 'industry'],

  organization: ['学生组织', '社团名称', '社团', '组织名称', '组织', 'organization'],
  role: ['担任职务', '校内职务', '职务', '角色', 'role'],

  projectName: ['项目名称', 'project name'],
  projectRole: ['项目角色', '项目职务', 'project role'],
  projectLink: ['项目链接', 'project link'],
  projectDescription: ['项目描述', '项目简介', 'project description'],
  projectDuty: ['项目职责', '项目职责描述', 'project duty', 'project responsibility'],

  honorName: ['奖项名称', '荣誉名称', '获奖名称', '获奖情况', '获奖经历', '荣誉奖项', '奖项', '荣誉', '获奖', 'honor', 'award'],
  honorLevel: ['奖项级别', '获奖级别', '奖项等级', '级别', 'level'],
  honorDate: ['获奖时间', '获奖日期', '获奖年月'],
  honorIssuer: ['颁发单位', '授予单位', '颁发机构'],
  honorDescription: ['奖项描述', '获奖描述', '奖项说明'],

  certificateName: ['证书名称', '资格证名称', '技能证书', '证书', '资格证', 'certificate', 'certification'],
  certificateIssuer: ['发证机构', '颁发机构', '发证单位', 'issuer'],
  certificateScore: ['证书等级', '证书分数', '相关证书等级/分数', '等级/分数'],
  certificateDate: ['发证时间', '获得时间', '取得时间'],
  certificateNumber: ['证书编号', '证书号'],

  volunteerOrganization: ['志愿组织', '志愿服务组织', '公益组织'],
  volunteerRole: ['志愿岗位', '志愿角色', '志愿职务'],
  volunteerHours: ['服务时长', '志愿时长', '志愿时长/服务时长'],
  volunteerDescription: ['志愿描述', '志愿服务内容', '志愿经历'],

  publicationTitle: ['论文名称', '论文标题', '著作名称', 'publication title'],
  publicationVenue: ['发表期刊', '期刊名称', '会议名称', 'venue'],
  publicationDate: ['发表时间', '出版时间'],
  publicationAuthorRank: ['作者排序', '作者排名', '作者位次'],
  publicationLink: ['论文链接', 'publication link'],
  publicationDescription: ['论文摘要', '论文描述', '摘要'],

  technical: ['技术技能', '专业技能', '技能特长', '技能', 'technical skills', 'skills'],
  tools: ['工具/软件', '开发工具', '工具', 'tools'],
  soft: ['软技能', '综合能力', 'soft skills'],

  languageName: ['语种', '语言名称', '语言', 'language'],
  languageLevel: ['精通程度', '语言熟练程度', '熟练程度', '掌握程度', 'language proficiency'],
  languageScore: ['语言成绩', '语言证书', '语言等级'],

  portfolio: ['作品集', '作品链接', 'portfolio'],
  works: ['代表作品', '个人作品', '作品展示', 'works'],
  blog: ['技术博客', '博客', '专栏', 'blog'],

  selfIntroduction: ['自我介绍', '自我描述', '个人简介', '个人评价', 'self introduction', 'about me'],
  careerObjective: ['求职意向', '职业目标', '应聘职位', 'career objective'],

  salary: ['期望薪资', '期望月薪', '薪资要求', '薪资', 'salary'],
  workAuthorization: ['工作许可', '工作授权', 'work authorization'],
  availability: ['到岗时间', '可入职时间', '入职时间', 'availability'],
  jobType: ['求职类型', '工作类型', 'job type'],
  preferredLocation: ['期望城市', '意向城市', '期望工作地', '期望工作城市', 'preferred location'],

  currentAnnual: ['当前年薪', 'current annual salary'],
  currentMonthly: ['当前月薪', 'current monthly salary'],
  salaryMonths: ['发薪月数', 'salary months'],
  bonus: ['奖金', 'bonus'],
  stock: ['股票', '期权', 'stock'],
  benefits: ['福利', 'benefits'],
  expectedAnnual: ['期望年薪', 'expected annual salary'],

  references: ['推荐人', 'references'],
  other: ['补充信息', '其他信息', 'other'],

  startDate: ['开始时间', '起始时间', '入职时间', '入学时间', 'start date', 'from'],
  endDate: ['结束时间', '截止时间', '离职时间', '毕业时间', 'end date', 'to'],
  description: ['工作描述', '工作内容', '工作职责', '职责', 'description', 'responsibilities']
};

const FILLABLE_SECTIONS = [
  'basics', 'education', 'internships', 'campus', 'projects', 'honors', 'certificates',
  'volunteer', 'publications', 'skills', 'languages', 'links', 'summary', 'preferences',
  'compensation', 'additional'
];

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[\s_*:：()（）\[\]【】/]/g, '');
}

function getLabelText(field) {
  const label = field.labels?.[0] || field.closest('label');
  const nearby = field.closest('div, section, li, td')?.innerText?.slice(0, 160);
  return normalize(`${label?.innerText || ''} ${field.name || ''} ${field.id || ''} ${field.placeholder || ''} ${field.getAttribute('aria-label') || ''} ${nearby || ''}`);
}

function findProfileKey(field) {
  const text = getLabelText(field);
  let matchedKey = '';
  let matchedLength = 0;
  Object.entries(FIELD_ALIASES).forEach(([key, aliases]) => {
    aliases.forEach((alias) => {
      const needle = normalize(alias);
      if (needle.length > matchedLength && text.includes(needle)) {
        matchedKey = key;
        matchedLength = needle.length;
      }
    });
  });
  return matchedKey;
}

function buildValues(profile) {
  const values = {};
  const push = (key, value) => {
    const text = String(value ?? '').trim();
    if (!key || !text) return;
    (values[key] ||= []).push(text);
  };
  FILLABLE_SECTIONS.forEach((section) => {
    const group = profile[section];
    if (!group || typeof group !== 'object') return;
    if (Array.isArray(group)) {
      group.forEach((entry) => Object.entries(entry).forEach(([key, value]) => push(key, value)));
    } else {
      Object.entries(group).forEach(([key, value]) => push(key, value));
    }
  });
  return values;
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
  const values = buildValues(migrateProfile(profile));
  const fields = [...document.querySelectorAll('input, textarea, select')].filter((field) => {
    if (field.disabled || field.readOnly) return false;
    return !['hidden', 'file', 'checkbox', 'radio', 'submit', 'button', 'reset'].includes(field.type);
  });
  let filled = 0;
  fields.forEach((field) => {
    const key = findProfileKey(field);
    const queue = key ? values[key] : null;
    if (!queue?.length) return;
    setFieldValue(field, queue.shift());
    filled += 1;
  });
  return { filled, total: fields.length };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'fill-form') {
    fillForm().then(sendResponse);
    return true;
  }
});
export const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  'Grade 9': [
    'Mathematics', 'Biology', 'Physics', 'History'
  ],
  'Grade 10': [
    'Mathematics', 'Biology', 'Chemistry', 'English', 'Geography', 'History'
  ],
  'Grade 11': [
    'Mathematics', 'Biology', 'Chemistry', 'English', 'Economics', 'Geography', 'Physics', 'English(S.S)'
  ],
  'Grade 12': [
    'Biology', 'Chemistry', 'Physics', 'English', 'Aptitude', 'Economics',
    'Aptitude(S.S)', 'History', 'English(S.S)', 'Geography', 'Chemistry(2016)',
    'Biology(2016)', 'English(2016)', 'History(2016)', 'Physics(2016)',
    'Mathematics(2016)', 'Geography(2016)', 'Aptitude(2016)', 'Economics(2016)',
    'Mathematics(S.S/2016)', 'Aptitude(S.S/2016)', 'English(S.S/2016)'
  ]
};

export const PAYMENT_INFO = {
  telebirr: {
    account: '0901705907',
    name: 'Adari Institute'
  },
  cbe: {
    account: '1000443797762',
    name: 'Adari Institute'
  },
  plans: {
    basic: {
      name: 'Basic Plan',
      price: '100 ETB',
      description: 'For one month.',
      groupPayment: false
    },
    premium: {
      name: 'Premium Plan',
      price: '150 ETB',
      description: 'Valid until the entrance exam day officially stated by Ministry of Education (more than 2 months).',
      groupPayment: true
    }
  }
};

const { google } = require('googleapis');

// Замените своими данными
const CLIENT_ID = '384732578674-igok6s2reibfkjg1um019o4ij14qchf2.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// URL для авторизации
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'], // Укажите нужные разрешения
});

console.log('Авторизуйтесь, перейдя по этой ссылке:', authUrl);

// После авторизации вставьте код в этот блок
oauth2Client.getToken('4/0AanRRrsEoJD6CbvhFikdKBrg40REvX54UJKes2lyllUIemu2Wgh5NBpEBQq1rFP13FoNhw', (err, token) => {
  if (err) return console.error('Ошибка при получении токена:', err);
  console.log('Ваш Refresh Token:', token.refresh_token);
});

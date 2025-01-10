import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
    "384732578674-igok6s2reibfkjg1um019o4ij14qchf2.apps.googleusercontent.com",
  "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"
);

auth.setCredentials({
  refresh_token: "1//09E0hqxGQ7Y2KCgYIARAAGAkSNwF-L9IrjC17YQZxCeaV2euvaZS0tTMb8EYIIqoAAeFMcF8-OvB29K4A4hp4IJd4tbcSk8RSI60",
});

async function getAccountInfo() {
  const oauth2 = google.oauth2({ auth, version: 'v2' });
  const res = await oauth2.userinfo.get();
  console.log("Подключённая учётная запись:", res.data.email);
}

getAccountInfo().catch((err) => {
  console.error("Ошибка при получении учётной записи:", err.message);
});

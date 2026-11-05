const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');

const client = new Client({ checkUpdate: false });
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WINDS Bot Status: 24/7 Active & Running');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

setInterval(() => {
  http.get(`http://localhost:${PORT}`, (res) => {}).on('error', (err) => {
    console.error('Keep-alive ping error:', err.message);
  });
}, 5 * 60 * 1000);

client.on('ready', async () => {
  console.log(`[+] Logged in successfully as ${client.user.tag}!`);

  let isLiveIndia = true;

  const updateStatus = () => {
    if (isLiveIndia) {
      // 1st Status: Only name "LIVE-INDIA" (1 Hour block) - No details, no state
      client.user.setPresence({
        status: 'online',
        activities: [{
          name: 'LIVE-INDIA',
          type: 'PLAYING'
        }]
      });
      console.log('[+] Status switched to: LIVE-INDIA (Name Only)');
    } else {
      // 2nd Status: Exact old Unity Status (5 Hours block)
      client.user.setPresence({
        status: 'online',
        activities: [{
          name: 'Unity',
          type: 'PLAYING',
          details: 'Editing LIVE-INDIA Scene',
          state: 'Project Open',
          application_id: '1566412255757865032',
          assets: {
            largeImage: '1000325844',
            largeText: 'Unity 2022.3.2f1'
          }
        }]
      });
      console.log('[+] Status switched to: Unity (Exact Old)');
    }
  };

  updateStatus();

  const runCycle = async () => {
    // 1 Hour duration for LIVE-INDIA
    setTimeout(async () => {
      isLiveIndia = false;
      updateStatus();

      // 5 Hours duration for Unity status
      setTimeout(async () => {
        isLiveIndia = true;
        updateStatus();
        runCycle();
      }, 5 * 60 * 60 * 1000);

    }, 1 * 60 * 60 * 1000);
  };

  runCycle();
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  process.exit(1);
}

client.login(token);

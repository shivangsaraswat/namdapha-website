const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// API Routes
exports.api = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const { method, url } = req;
    const path = url.split('/api')[1];

    try {
      switch (true) {
        case method === 'GET' && path === '/events':
          return await getEvents(req, res);
        
        case method === 'GET' && path === '/council':
          return await getCouncil(req, res);
        
        case method === 'GET' && path === '/teams':
          return await getTeams(req, res);
        
        case method === 'GET' && path === '/resources':
          return await getResources(req, res);
        
        case method === 'POST' && path === '/contact':
          return await postContact(req, res);
        
        default:
          return res.status(404).json({ error: 'Route not found' });
      }
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Get Events
async function getEvents(req, res) {
  try {
    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.orderBy('date', 'desc').get();
    
    const events = [];
    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    return res.json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get Council Members
async function getCouncil(req, res) {
  try {
    const councilRef = db.collection('council');
    const snapshot = await councilRef.get();
    
    const council = [];
    snapshot.forEach(doc => {
      council.push({ id: doc.id, ...doc.data() });
    });
    
    return res.json({ success: true, data: council });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get Teams
async function getTeams(req, res) {
  try {
    const teamsRef = db.collection('teams');
    const snapshot = await teamsRef.get();
    
    const teams = [];
    snapshot.forEach(doc => {
      teams.push({ id: doc.id, ...doc.data() });
    });
    
    return res.json({ success: true, data: teams });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get Resources
async function getResources(req, res) {
  try {
    const resourcesRef = db.collection('resources');
    const snapshot = await resourcesRef.get();
    
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    
    return res.json({ success: true, data: resources });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Post Contact Form
async function postContact(req, res) {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const contactRef = db.collection('contacts');
    await contactRef.add({
      name,
      email,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.json({ success: true, message: 'Contact form submitted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
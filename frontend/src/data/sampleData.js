export const incidents = [
  {
    id: 1,
    title: 'Street light not working',
    category: 'Infrastructure',
    severity: 'Medium',
    location: 'Gate 2, Green Park Colony',
    status: 'In Progress',
    description: 'The street light near Gate 2 has been off for three nights.',
    comments: [{ id: 1, user: { name: 'Admin' }, message: 'Maintenance team has been informed.' }]
  },
  {
    id: 2,
    title: 'Suspicious vehicle parked overnight',
    category: 'Suspicious Activity',
    severity: 'High',
    location: 'Block C Parking',
    status: 'Reported',
    description: 'A grey van has been parked near Block C since yesterday evening.',
    comments: []
  },
  {
    id: 3,
    title: 'Loose electrical wire',
    category: 'Hazard',
    severity: 'High',
    location: 'Near community garden',
    status: 'Resolved',
    description: 'Wire was hanging low near the walkway.'
  }
];

export const announcements = [
  { id: 1, title: 'Community patrol meeting', message: 'Residents are invited to the clubhouse at 6 PM this Friday.' },
  { id: 2, title: 'CCTV maintenance', message: 'Main gate cameras will be serviced tomorrow morning.' }
];

export const notifications = [
  { id: 1, title: 'Report status updated', message: 'Your street light report is now In Progress.' },
  { id: 2, title: 'New announcement', message: 'A community patrol meeting has been posted.' }
];

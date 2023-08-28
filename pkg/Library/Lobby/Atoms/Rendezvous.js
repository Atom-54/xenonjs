export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
onEnterVenue({eventlet: persona}) {
  //
},
enterVenue({personas}, persona, room='lobby') {
  const record = personas[persona] ??= {
    id: persona,
    rooms: [],
  };
  record.rooms = [...new Set([...record.rooms, room])];
},
leaveVenue ({personas}, persona, room) {
  if (room) {
    const {rooms} = personas[persona];
    rooms.splice(rooms.indexOf(room), 1);
  } else {
    delete personas[persona];
  }
},
getRooms({personas}) {
  const allRooms = {};
  Object.values(personas).forEach(({id, rooms}) => {
    rooms.forEach(room => {
      const space = allRooms[room] ??= new Set();
      space.add(id);
    });
  });
  return allRooms;
},
renderVenue({personas}) {
  const rooms = getRooms({personas});
  const pp = [
    Object.values(personas).map(({id, rooms}) => `${id}: ${rooms.toString()}`).join('<br>'),
    '<hr><h2>Rooms</h2>',
    Object.entries(rooms).map(([room, ids]) => `${room}: ${[...ids].toString()}`).join('<br>')
  ];
  window.venue.innerHTML = pp.join('');
  console.log(getRooms({personas}));
}
});
  
https://www.npmjs.com/package/@event-calendar/list#parsing-event-from-a-plain-object

{
  //id
  //resourceId
  //resourceIds[]
  title
  start: Date // or ISO8601, e.g. '2022-12-31 09:00:00'
  end: Date
  allDay: Boolean
  color (or backgroundColor)
  textColor
  //editable
  //startEditable
  //display // 'auto' (default) or 'background'
  //extendedProps
}
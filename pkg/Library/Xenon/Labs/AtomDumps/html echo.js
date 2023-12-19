(({log, resolve}) => ({

render({html}) {
  log('Mr. Atoz: library is', resolve('$library'));
  if (html && (typeof html !== 'string')) {
    html = JSON.stringify(html, null, '  ');
  }
  return {html};
},

template: html`
<h1 unsafe-html="{{html}}"></h1>
`

}))
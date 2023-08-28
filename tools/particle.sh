#!/bin/sh
cat > $1.js << EndOfMessage
/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
({
update({}, state, tools) {
},
render({}, {}, tools) {
},
template: html\`
\`
});
EndOfMessage
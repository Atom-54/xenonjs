import {Xen} from '../../Dom/Xen/xen-async.js';

const template = Xen.Template.html`
<style>
  :host {
    position: absolute;
    flex: 0 !important;
  }
  [scrim], [flyout] {
    z-index: 10000;
  }
  [scrim] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #888888;
    opacity: 0.75;
    transform: translateX(120%);
  }
  [scrim][show] {
    transform: translateX(0);
  }
  [flyout] {
    position: fixed;
    transition: transform 200ms ease-in;
    overflow: hidden;
    /**/
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  [side=right], [side=left] {
    top: 0;
    bottom: 0;
    width: 75%;
    min-width: min(320px, 100vw);
    max-width: min(100vw, 800px);
  }
  [side=top], [side=bottom] {
    right: 0;
    height: 75%;
    left: 0;
  }
  [side=right] {
    right: 0;
    transform: translateX(120%);
  }
  [side=left] {
    left: 0;
    transform: translateX(-120%);
  }
  [side=bottom] {
    bottom: 0;
    transform: translateY(120%);
  }
  [side=top] {
    top: 0;
    transform: translateY(-120%);
  }
  [flyout][show] {
    transform: translateX(0) translateY(0);
    height: auto;
    overflow: auto;
  }
  /* slot::slotted(*) {
    background-color: var(--xcolor-one);
  } */
</style>

<div scrim show$="{{showTools}}" on-click="onToggleFlyOver"></div>

<div flyout side$="{{side}}" show$="{{showTools}}" xon-click="onToggleFlyOver">
  <slot name="flyout"></slot>
</div>
`;

export class FlyOut extends Xen.Async {
  static get observedAttributes() {
    return ['show', 'side'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.tabIndex = 0;
    this.focus();
    window.addEventListener('keyup', e => this.onKeyUp(e));
  }
  render({show, side}) {
    return {
      side: side ?? 'top',
      showTools: show
    };
  }
  async onToggleFlyOver() {
    this.fire('toggle');
  }
  onKeyUp(e) {
    if (this.show) {
      if (e.key === 'Escape') {
        this.onToggleFlyOver();
      }
    }
  }
}
customElements.define('fly-out', FlyOut);

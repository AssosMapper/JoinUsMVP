import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import * as DOMPurifyModule from 'dompurify';

@Injectable()
export class AllowedHtmlGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    const purifyConfig = {
      FORBID_TAGS: ['script', 'style'],
      FORBID_ATTR: [
        'onclick',
        'onload',
        'onerror',
        'onmouseover',
        'onmouseout',
        'onmousedown',
        'onmouseup',
        'onkeydown',
        'onkeyup',
        'onkeypress',
        'onfocus',
        'onblur',
        'onchange',
        'onsubmit',
        'onreset',
        'onselect',
        'onresize',
        'onscroll',
        'onunload',
        'onbeforeunload',
        'ondragstart',
        'ondrop',
        'ondragover',
        'ondragenter',
        'ondragleave',
        'ondragend',
        'oncontextmenu',
        'oninput',
        'oninvalid',
        'onsearch',
        'ontouchstart',
        'ontouchend',
        'ontouchmove',
        'ontouchcancel',
        'onpointerdown',
        'onpointerup',
        'onpointermove',
        'onpointerover',
        'onpointerout',
        'onpointerenter',
        'onpointerleave',
        'onpointercancel',
        'ongotpointercapture',
        'onlostpointercapture',
        'onanimationend',
        'onanimationiteration',
        'onanimationstart',
        'ontransitionend',
        'onwheel',
        'onplay',
        'onpause',
        'onended',
        'onloadstart',
        'onprogress',
        'onsuspend',
        'onemptied',
        'onstalled',
        'onloadedmetadata',
        'onloadeddata',
        'oncanplay',
        'oncanplaythrough',
        'onseeking',
        'onseeked',
        'ontimeupdate',
        'onvolumechange',
        'onwaiting',
        'ondurationchange',
        'onratechange',
      ],
    };

    this.sanitizeContentFields(body, purifyConfig);

    return true;
  }

  private sanitizeContentFields(obj: any, config: any): void {
    if (!obj || typeof obj !== 'object') return;

    if (typeof obj.content === 'string') {
      const originalContent = obj.content;
      const window = new JSDOM('').window;
      const DOMPurify = (DOMPurifyModule as any).default
        ? (DOMPurifyModule as any).default(window)
        : DOMPurifyModule(window);

      obj.content = DOMPurify.sanitize(originalContent, config);
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
        this.sanitizeContentFields(obj[key], config);
      }
    }
  }
}

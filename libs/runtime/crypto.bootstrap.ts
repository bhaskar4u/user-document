import * as crypto from 'crypto';

// Make crypto globally available for Node
if (!(global as any).crypto) {
  (global as any).crypto = crypto;
}

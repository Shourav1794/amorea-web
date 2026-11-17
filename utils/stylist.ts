export type StylistReplyKey =
  | 'chatDefaultReply'
  | 'chatClothingReply'
  | 'chatSkincareReply'
  | 'chatPriceReply';

export function getStylistReplyKey(message: string): StylistReplyKey {
  const lower = message.toLowerCase();

  if (
    lower.includes('pakistani') ||
    lower.includes('dress') ||
    lower.includes('ড্রেস') ||
    lower.includes('পোশাক')
  ) {
    return 'chatClothingReply';
  }

  if (
    lower.includes('skin') ||
    lower.includes('serum') ||
    lower.includes('cream') ||
    lower.includes('ত্বক')
  ) {
    return 'chatSkincareReply';
  }

  if (
    lower.includes('price') ||
    lower.includes('dam') ||
    lower.includes('দাম')
  ) {
    return 'chatPriceReply';
  }

  return 'chatDefaultReply';
}

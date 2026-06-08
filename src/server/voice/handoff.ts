/**
 * Builds the Coach review URL after a Voice Note handoff.
 *
 * Args:
 *   args: Linked ThoughtReview id and optional VoiceNote id.
 *
 * Returns:
 *   A relative Coach URL focused on the generated review.
 */
export function buildVoiceCoachReviewHref(args: {
  reviewId: string;
  voiceNoteId?: string | null;
}) {
  const reviewId = encodeURIComponent(args.reviewId);
  const voiceNoteId = args.voiceNoteId ? `&voiceNoteId=${encodeURIComponent(args.voiceNoteId)}` : "";
  return `/coach?reviewId=${reviewId}&source=voice-note${voiceNoteId}`;
}

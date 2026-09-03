/**
 * The modal slot renders nothing unless a project route has been intercepted
 * into it. Without this file Next has no fallback for the slot and every
 * other route in the group 404s.
 */
export default function ModalDefault() {
  return null;
}

// utils/normalizeId.js
export const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === "object") {
    if (id.$oid) return id.$oid; // MongoDB legacy
    if (id._id) return id._id;   // populated object
  }
  return String(id);
};

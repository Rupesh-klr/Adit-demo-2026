// Simple encryption (for demo only)
export default function encrypt(data) {
  // In real-world, use a proper encryption library  name: btoa(data.name),email: btoa(data.email),phone: btoa(data.phone),
  return {
    ...data,
    name: data.name,
    email: data.email,
    phone: data.phone,
  };
}

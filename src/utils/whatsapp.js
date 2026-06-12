const WHATSAPP_NUMBER = '919962285822';

export const getWhatsAppLink = (productName = null) => {
  let message;
  if (productName) {
    message = `Hi SFIT! I'm interested in ${productName} — please share pricing and availability.`;
  } else {
    message = `Hi SFIT! I'd like to know more about your products. Please share your catalog.`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const getWhatsAppCategoryLink = (categoryName) => {
  const message = `Hi SFIT! I'm looking for products in the ${categoryName} category. Please share what's available.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const WHATSAPP_DIRECT = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = 'https://www.instagram.com/sfitkitchen';

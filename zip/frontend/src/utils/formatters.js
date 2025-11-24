//src/utils/formatters.js
export const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);
};

export const formatDate = (value) => {
  if (!value) return "";

  // Caso seja Timestamp do Firestore
  if (value.toDate) {
    value = value.toDate();
  }

  // Caso seja string
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d)) value = d;
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return "";
};

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Evento `purchase` de GA4 (sirve como conversión en Google Ads).
// Solo para pagos aprobados y una única vez por pago aunque se recargue la página.
function trackPurchase(paymentData, paymentId) {
  if (paymentData?.status !== "approved") return;
  const transactionId = String(paymentId);
  const claveVisto = `ga_purchase_${transactionId}`;
  try {
    if (localStorage.getItem(claveVisto)) return;
    localStorage.setItem(claveVisto, "1");
  } catch {
    // sin localStorage: se envía igual, GA4 deduplica por transaction_id
  }

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag("event", "purchase", {
    transaction_id: transactionId,
    value: Number(paymentData.transaction_amount) || 0,
    currency: paymentData.currency_id || "ARS",
    items: (paymentData.additional_info?.items || []).map((it) => ({
      item_id: String(it.id || it.title || ""),
      item_name: it.title,
      price: Number(it.unit_price) || 0,
      quantity: Number(it.quantity) || 1,
    })),
  });
}

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("payment_id");

    if (paymentId) {
      fetch(`/api/pedidos/verificar-pago?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Pago verificado:");
          trackPurchase(data?.paymentData, paymentId);
        })
        .catch((err) => {
          console.error("Error al verificar el pago:", err);
        });
    }

    const timer = setTimeout(() => {
      router.push("/Dashboard");
    }, 5000); // redirige a los 5 segundos

    return () => clearTimeout(timer); // limpieza del timeout
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
      <div className="bg-primary-background shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h1>
        <p className="text-gray-700 mb-6">Estamos procesando tu pedido. Serás redirigido en unos segundos...</p>
        <button onClick={() => router.push("/Dashboard")} className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-hover transition">
          Ir a Mis Pedidos ahora
        </button>
      </div>
    </div>
  );
}

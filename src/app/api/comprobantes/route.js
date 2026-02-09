import { connectDB } from '../../../lib/mongodb';
import Comprobante from '../../../models/Comprobante';

/**
 * GET: Obtener todos los comprobantes o filtrar por empresa/tipo
 * Query params opcionales:
 * - empresaNombre: filtrar por nombre de empresa
 * - tipo: filtrar por tipo (presupuesto/recibo)
 * - desde: fecha desde (YYYY-MM-DD)
 * - hasta: fecha hasta (YYYY-MM-DD)
 */
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const empresaNombre = searchParams.get('empresaNombre');
    const tipo = searchParams.get('tipo');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');
    
    let filtro = {};
    
    if (empresaNombre) {
      filtro['empresa.nombre'] = { $regex: empresaNombre, $options: 'i' };
    }
    
    if (tipo) {
      filtro.tipo = tipo;
    }
    
    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }
    
    const comprobantes = await Comprobante.find(filtro)
      .sort({ createdAt: -1 }) // Más recientes primero
      .limit(100); // Limitar a 100 resultados
    
    return Response.json(comprobantes);
  } catch (error) {
    console.error('Error al obtener comprobantes:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener comprobantes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST: Crear un nuevo comprobante
 * Body: { tipo, fecha, empresa, items, pagos?, total }
 */
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Validar campos requeridos
    if (!data.tipo || !data.empresa || !data.items || data.items.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Faltan campos requeridos: tipo, empresa, items' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calcular total si no viene
    if (!data.total) {
      data.total = data.items.reduce((acc, item) => {
        const cantidad = Number(item.cantidad) || 0;
        const precio = Number(item.precio) || 0;
        const dolar = Number(item.dolar) || 1;
        const precioFinal = item.usd ? precio * dolar : precio;
        return acc + cantidad * precioFinal;
      }, 0);
    }
    
    const nuevoComprobante = await Comprobante.create(data);
    
    return new Response(JSON.stringify(nuevoComprobante), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al crear comprobante:', error);
    return new Response(JSON.stringify({ error: 'Error al crear comprobante' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

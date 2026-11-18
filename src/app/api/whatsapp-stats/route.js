import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import WhatsappStats from '../../../models/whatsappStatsSchema';

export async function POST(request) {
  try {
    await connectDB();
    
    const { tipo } = await request.json();
    
    if (!tipo || (tipo !== 'administracion' && tipo !== 'ventas')) {
      return NextResponse.json(
        { error: 'Tipo inválido. Debe ser "administracion" o "ventas"' },
        { status: 400 }
      );
    }

    // Registrar el clic con timestamp
    await WhatsappStats.create({
      tipo,
      timestamp: new Date(),
      fecha: new Date().toISOString().split('T')[0], // Solo la fecha para agrupación
    });

    return NextResponse.json({ success: true, message: 'Clic registrado' });
  } catch (error) {
    console.error('Error al registrar clic de WhatsApp:', error);
    return NextResponse.json(
      { error: 'Error al registrar el clic' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || '30'; // días por defecto

    const diasAtras = parseInt(periodo);
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - diasAtras);

    // Obtener estadísticas totales por tipo
    const statsAdministracion = await WhatsappStats.countDocuments({
      tipo: 'administracion',
      timestamp: { $gte: fechaInicio }
    });

    const statsVentas = await WhatsappStats.countDocuments({
      tipo: 'ventas',
      timestamp: { $gte: fechaInicio }
    });

    // Obtener estadísticas por día usando agregación
    const statsPorDia = await WhatsappStats.aggregate([
      {
        $match: {
          timestamp: { $gte: fechaInicio }
        }
      },
      {
        $group: {
          _id: {
            fecha: '$fecha',
            tipo: '$tipo'
          },
          clics: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.fecha': 1 }
      }
    ]);

    // Formatear datos para el gráfico
    const datosPorDia = {};
    statsPorDia.forEach(item => {
      const fecha = item._id.fecha;
      if (!datosPorDia[fecha]) {
        datosPorDia[fecha] = { fecha, administracion: 0, ventas: 0 };
      }
      datosPorDia[fecha][item._id.tipo] = item.clics;
    });

    const datosGrafico = Object.values(datosPorDia);

    return NextResponse.json({
      totales: {
        administracion: statsAdministracion,
        ventas: statsVentas,
        total: statsAdministracion + statsVentas
      },
      porDia: datosGrafico,
      periodo: diasAtras
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de WhatsApp:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

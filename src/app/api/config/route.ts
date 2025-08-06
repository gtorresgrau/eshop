import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import UserConfig from '../../../models/UserConfig';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Conexión a MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI as string);
}

export async function GET() {
  try {
    await connectDB();
    const config = await UserConfig.findOne().lean();
    
    if (!config) {
      // Si no existe configuración, devolver valores por defecto
      const defaultConfig = new UserConfig();
      return NextResponse.json(defaultConfig.toObject());
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo la configuración:', error);
    return NextResponse.json(
      { error: 'Error obteniendo la configuración' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validar datos básicos
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Datos inválidos' }, 
        { status: 400 }
      );
    }

    // Buscar y actualizar o crear
    const config = await UserConfig.findOneAndUpdate(
      {}, 
      data, 
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );

    return NextResponse.json({ 
      message: 'Configuración guardada correctamente',
      config 
    });
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await UserConfig.deleteMany();
    return NextResponse.json({ message: 'Configuración eliminada' });
  } catch (error) {
    console.error('Error eliminando la configuración:', error);
    return NextResponse.json(
      { error: 'Error eliminando la configuración' }, 
      { status: 500 }
    );
  }
}
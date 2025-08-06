'use client'
import React, { useEffect, useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/Buttons';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

type ConfigType = {
  basicData: {
    name: string;
    direccion: string;
    email: string;
    cuil: string;
  };
  contact: {
    telefono: string;
    codigoPais: string;
    textoPredefinido: string;
    textBoton: string;
    botonNav: string;
    whatsappActivo: boolean;
  };
  administracion: {
    label: string;
    contacto: string;
    codigoPais: string;
    textoPredefinido: string;
  };
  ventas: {
    label: string;
    contacto: string;
    codigoPais: string;
    textoPredefinido: string;
  };
  multimedia: {
    portada: {
      tipo: string;
      url: string;
    };
    logo: string;
    favicon: string;
  };
  banco: {
    banco: string;
    cbu: string;
    alias: string;
    titular: string;
    cuit: string;
  };
  redesSociales: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  textosDestacados: {
    homeBanner: string;
    avisoLegal: string;
  };
  horarioAtencion: {
    dias: string;
    horas: string;
  };
  mantenimiento: {
    activo: boolean;
    mensaje: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    imagenCompartida: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    modoOscuro: boolean;
    fuentePrincipal: string;
  };
  configuracionTienda: {
    modoCatalogo: boolean;
    mostrarStock: boolean;
    permitirComprasSinLogin: boolean;
    carritoActivo: boolean;
    enviarWhatsappAuto: boolean;
  };
  envios: {
    metodo: string;
    tiempoEstimado: string;
    retiroLocal: boolean;
    costoFijo: number;
    gratisDesde: number;
  };
  adminAccess: {
    usuariosAutorizados: string[];
    claveSeguridad: string;
  };
};

const defaultConfig: ConfigType = {
  basicData: {
    name: '',
    direccion: '',
    email: '',
    cuil: ''
  },
  contact: {
    telefono: '',
    codigoPais: '54',
    textoPredefinido: '',
    textBoton: '',
    botonNav: '',
    whatsappActivo: true
  },
  administracion: {
    label: '',
    contacto: '',
    codigoPais: '',
    textoPredefinido: ''
  },
  ventas: {
    label: '',
    contacto: '',
    codigoPais: '',
    textoPredefinido: ''
  },
  multimedia: {
    portada: {
      tipo: 'imagen',
      url: ''
    },
    logo: '',
    favicon: ''
  },
  banco: {
    banco: '',
    cbu: '',
    alias: '',
    titular: '',
    cuit: ''
  },
  redesSociales: {
    instagram: '',
    facebook: '',
    tiktok: ''
  },
  textosDestacados: {
    homeBanner: '',
    avisoLegal: ''
  },
  horarioAtencion: {
    dias: '',
    horas: ''
  },
  mantenimiento: {
    activo: false,
    mensaje: ''
  },
  seo: {
    title: '',
    description: '',
    keywords: [],
    imagenCompartida: ''
  },
  branding: {
    primaryColor: '',
    secondaryColor: '',
    modoOscuro: false,
    fuentePrincipal: ''
  },
  configuracionTienda: {
    modoCatalogo: false,
    mostrarStock: true,
    permitirComprasSinLogin: true,
    carritoActivo: true,
    enviarWhatsappAuto: true
  },
  envios: {
    metodo: '',
    tiempoEstimado: '',
    retiroLocal: true,
    costoFijo: 0,
    gratisDesde: 0
  },
  adminAccess: {
    usuariosAutorizados: [],
    claveSeguridad: ''
  }
};

const AdminConfigPage = () => {
  const [data, setData] = useState<ConfigType>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleChange = (section: keyof ConfigType, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedChange = (section: keyof ConfigType, subSection: string, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...(prev[section] as any)[subSection],
          [key]: value
        }
      }
    }));
  };

  const handleArrayChange = (section: keyof ConfigType, key: string, value: string[]) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (!res.ok) throw new Error('Error en la respuesta');
        const json = await res.json();
        if (json) {
          setData(prev => ({ ...prev, ...json }));
        }
      } catch (error) {
        console.error("Error cargando configuración:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const guardarConfig = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error en la respuesta');

      const result = await res.json();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Configuración de Tienda</h1>

      {/* Sección de Datos Básicos */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Datos Básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre de la Tienda</Label>
            <Input
              id="name"
              value={data.basicData.name}
              onChange={(e) => handleChange('basicData', 'name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={data.basicData.direccion}
              onChange={(e) => handleChange('basicData', 'direccion', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.basicData.email}
              onChange={(e) => handleChange('basicData', 'email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cuil">CUIL/CUIT</Label>
            <Input
              id="cuil"
              value={data.basicData.cuil}
              onChange={(e) => handleChange('basicData', 'cuil', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoPais">Código de País</Label>
            <Input
              id="codigoPais"
              value={data.contact.codigoPais}
              onChange={(e) => handleChange('contact', 'codigoPais', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={data.contact.telefono}
              onChange={(e) => handleChange('contact', 'telefono', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="textoPredefinido">Texto Predefinido WhatsApp</Label>
            <Input
              id="textoPredefinido"
              value={data.contact.textoPredefinido}
              onChange={(e) => handleChange('contact', 'textoPredefinido', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="textBoton">Texto del Botón</Label>
            <Input
              id="textBoton"
              value={data.contact.textBoton}
              onChange={(e) => handleChange('contact', 'textBoton', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="botonNav">Texto en Navegación</Label>
            <Input
              id="botonNav"
              value={data.contact.botonNav}
              onChange={(e) => handleChange('contact', 'botonNav', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="whatsappActivo"
              checked={data.contact.whatsappActivo}
              onCheckedChange={(checked) => handleChange('contact', 'whatsappActivo', checked)}
            />
            <Label htmlFor="whatsappActivo">WhatsApp Activo</Label>
          </div>
        </div>
      </section>

      {/* Sección Multimedia */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Multimedia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="portadaTipo">Tipo de Portada</Label>
            <Select
              value={data.multimedia.portada.tipo}
              onVolumeChange={(value) => handleNestedChange('multimedia', 'portada', 'tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imagen">Imagen</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="portadaUrl">URL de la Portada</Label>
            <Input
              id="portadaUrl"
              value={data.multimedia.portada.url}
              onChange={(e) => handleNestedChange('multimedia', 'portada', 'url', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="logo">URL del Logo</Label>
            <Input
              id="logo"
              value={data.multimedia.logo}
              onChange={(e) => handleChange('multimedia', 'logo', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="favicon">URL del Favicon</Label>
            <Input
              id="favicon"
              value={data.multimedia.favicon}
              onChange={(e) => handleChange('multimedia', 'favicon', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Sección Configuración de Tienda */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Configuración de Tienda</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
              <Switch
              id="modoCatalogo"
              checked={data.configuracionTienda.modoCatalogo}
              onCheckedChange={(checked) => handleNestedChange('configuracionTienda', '', 'modoCatalogo', checked)}
            />
            <Label htmlFor="modoCatalogo">Modo Catálogo (sin compras)</Label>
          </div>
          <div className="flex items-center space-x-2">
              <Switch
              id="mostrarStock"
              checked={data.configuracionTienda.mostrarStock}
              onCheckedChange={(checked) => handleNestedChange('configuracionTienda', '', 'mostrarStock', checked)}
            />
            <Label htmlFor="mostrarStock">Mostrar Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
              <Switch
              id="permitirComprasSinLogin"
              checked={data.configuracionTienda.permitirComprasSinLogin}
              onCheckedChange={(checked) => handleNestedChange('configuracionTienda', '', 'permitirComprasSinLogin', checked)}
            />
            <Label htmlFor="permitirComprasSinLogin">Permitir compras sin login</Label>
          </div>
          <div className="flex items-center space-x-2">
              <Switch
              id="carritoActivo"
              checked={data.configuracionTienda.carritoActivo}
              onCheckedChange={(checked) => handleNestedChange('configuracionTienda', '', 'carritoActivo', checked)}
            />
            <Label htmlFor="carritoActivo">Carrito Activo</Label>
          </div>
          <div className="flex items-center space-x-2">
              <Switch
              id="enviarWhatsappAuto"
              checked={data.configuracionTienda.enviarWhatsappAuto}
              onCheckedChange={(checked) => handleNestedChange('configuracionTienda', '', 'enviarWhatsappAuto', checked)}
            />
            <Label htmlFor="enviarWhatsappAuto">Enviar WhatsApp automático</Label>
          </div>
        </div>
      </section>

      {/* Sección Envíos */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Configuración de Envíos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metodoEnvio">Método de Envío</Label>
            <Select
              value={data.envios.metodo}
              onVolumeChange={(value) => handleChange('envios', 'metodo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="correo">Correo</SelectItem>
                <SelectItem value="motomensajeria">Moto Mensajería</SelectItem>
                <SelectItem value="retiro">Retiro en Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tiempoEstimado">Tiempo Estimado</Label>
            <Input
              id="tiempoEstimado"
              value={data.envios.tiempoEstimado}
              onChange={(e) => handleChange('envios', 'tiempoEstimado', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="retiroLocal"
              checked={data.envios.retiroLocal}
              onCheckedChange={(checked) => handleChange('envios', 'retiroLocal', checked)}
            />
            <Label htmlFor="retiroLocal">Permitir retiro en local</Label>
          </div>
          <div>
            <Label htmlFor="costoFijo">Costo Fijo de Envío</Label>
            <Input
              id="costoFijo"
              type="number"
              value={data.envios.costoFijo}
              onChange={(e) => handleChange('envios', 'costoFijo', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="gratisDesde">Envío Gratis desde</Label>
            <Input
              id="gratisDesde"
              type="number"
              value={data.envios.gratisDesde}
              onChange={(e) => handleChange('envios', 'gratisDesde', Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Botón de Guardar */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={guardarConfig}
          disabled={saveStatus === 'saving'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors"
        >
          {saveStatus === 'saving' ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
          ) : 'Guardar Configuración'}
        </Button>
      </div>

      {/* Notificación de estado */}
      {saveStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Configuración guardada correctamente
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Error al guardar la configuración
        </div>
      )}
    </div>
  );
};

export default AdminConfigPage;
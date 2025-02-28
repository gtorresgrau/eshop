import React, { useState, useMemo } from "react";
import { Gamepad2, Sparkles, CheckCircle, ChevronRight, Clock, Shield, Star } from "lucide-react";
import { Button } from "../ui/Buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Badge } from "../ui/Badge";
import { consoles } from "@/app/constants/infoWeb";

export default function ConsoleCleaningService() {
  const [selectedConsole, setSelectedConsole] = useState("ps5");

  const consoleList = useMemo(() => Object.entries(consoles), []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="mb-8 text-3xl md:text-4xl text-center font-extrabold text-primary uppercase ">Servicio Profesional de Limpieza de Consolas</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mejora el rendimiento y extiende la vida útil de tus consolas con nuestro servicio especializado de limpieza y mantenimiento.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl relative">
          <Sparkles className="w-12 h-12 text-blue-500 animate-pulse absolute -top-4 -right-4" />
          <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
            <Gamepad2 className="w-20 h-20 text-primary mb-4" alt="Icono de consola" />
            <h3 className="text-2xl font-bold mb-2">¿Por qué limpiar tu consola?</h3>
            <ul className="space-y-3 mt-4">
              {["Reduce el ruido del ventilador", "Previene sobrecalentamiento", "Mejora el rendimiento general", "Extiende la vida útil de tu consola"].map((reason, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nuestros Servicios de Limpieza</CardTitle>
            <CardDescription>Selecciona tu consola para ver detalles específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ps5" value={selectedConsole} onValueChange={setSelectedConsole} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                {["ps5", "ps4", "ps3", "xbox","PC"].map((console) => (
                  <TabsTrigger key={console} value={console} title={`Seleccionar ${console.toUpperCase()}`}>{console.toUpperCase()}</TabsTrigger>
                ))}
              </TabsList>

              {consoleList.map(([key, console]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{console.name}</h3>
                    <Badge variant="secondary" className="text-lg font-semibold">{console.price}</Badge>
                  </div>
                  <p className="text-muted-foreground h-20">{console.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4">
                    <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>Tiempo: {console.time}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                      <Shield className="w-5 h-5 text-muted-foreground"  />
                      <span>Garantía: 30 días</span>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full uppercase bg-green-500" title="Reservar servicio de limpieza" aria-label="Reservar servicio de limpieza">
              Reservar Servicio x Whatsapp <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[{ icon: Sparkles, title: "Limpieza Profesional", desc: "Utilizamos herramientas especializadas y técnicas profesionales para una limpieza completa y segura." },
          { icon: Clock, title: "Servicio Rápido", desc: "La mayoría de nuestros servicios se completan en 1 dia, dependiendo del modelo y condición." },
          { icon: Star, title: "Resultados Garantizados", desc: "Ofrecemos garantía en todos nuestros servicios para tu tranquilidad y satisfacción." }].map((service, index) => (
          <Card key={index}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>{service.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import userData from "../components/constants/userData"
import logoEmpresa from '../../public/icons/icon-152x152.png'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import getImageBase64 from "./getImageBase64"


const generarPDF = async (empresa, items) => {
    const imageData = await getImageBase64(logoEmpresa.src)
    const doc = new jsPDF()
    const clienteX = 120 

    doc.addImage(imageData, 'PNG', 160, 10, 35, 15)
    doc.setFontSize(16)
    doc.text('PRESUPUESTO', 15, 15)
    
    doc.setFontSize(10)
    // 🏢 Datos de mi empresa (izquierda)
    doc.text(`${userData.name}`, 15, 52)
    doc.text(`${userData.email}`, 15, 59)
    doc.text(`+${userData.codigoPais}${userData.contact}`, 15, 66)
    doc.text(`${userData.cuil}`, 15, 73)

    // 🧾 Datos del cliente (derecha)
    doc.text(`Empresa: ${empresa.nombre}`, clienteX, 45)
    doc.text(`Dirección: ${empresa.direccion}`, clienteX, 52)
    doc.text(`Email: ${empresa.mail}`, clienteX, 59)
    doc.text(`Teléfono: ${empresa.telefono}`, clienteX, 66)
    doc.text(`CUIL: ${empresa.cuil}`, clienteX, 73)
  
    
    doc.setFontSize(12)
    autoTable(doc, {
        head: [['Cantidad', 'Producto', 'Código', 'Precio', 'Total']],
        body: items.map(item => [
          item.cantidad,
          item.producto,
          item.codigo,
          item.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'}),
          (item.cantidad * item.precio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})
        ]),
        startY: 83,
        margin: { bottom: 20 } // ✅ así está bien
    })

    const finalY = doc.lastAutoTable?.finalY || 100
    const total = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0)
  
    doc.text(`Total: ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}`, 150, finalY + 20 )

    doc.setFillColor(28, 58, 109) // azul (tu color institucional)
    doc.rect(0, 280, 210, 17, 'F') // x, y, width, height, 'F' = filled

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('Este documento no es válido como factura, es un presupuesto con impuestos incluidos.', 30, 285)

    // 🌐 URL clickeable debajo
    doc.textWithLink('Para ver más productos puede ingresar en www.centralcamshop.com', 30, 291, { url: 'https://www.centralcamshop.com' })

    const pdfBlob = doc.output('blob')
    const file = new File([pdfBlob], `presupuesto_${empresa.nombre}.pdf`, {
      type: 'application/pdf'
    })
  
    doc.save(`presupuesto_${empresa.nombre}.pdf`)
    return file
 }
  
 export default generarPDF
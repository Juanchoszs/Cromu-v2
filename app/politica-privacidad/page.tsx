"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, Lock, Eye, Share2, Users, FileText, Mail, Phone } from "lucide-react"

export default function PoliticaPrivacidadPage() {
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Definir las traducciones
  const translations = {
    watermark: {
      es: "PRIVACIDAD",
      en: "PRIVACY"
    },
    title: {
      es: "Política de Privacidad",
      en: "Privacy Policy"
    },
    subtitle: {
      es: "PROTECCIÓN DE SUS DATOS PERSONALES",
      en: "PROTECTION OF YOUR PERSONAL DATA"
    },
    lastUpdated: {
      es: "Última actualización: 13 de junio de 2025",
      en: "Last updated: June 13, 2025"
    },
    tagline: {
      es: "Su privacidad es nuestra prioridad",
      en: "Your privacy is our priority"
    },
    sections: {
      info: {
        title: {
          es: "Información que Recopilamos",
          en: "Information We Collect"
        },
        icon: Eye,
        content: {
          es: [
            "En CROMU recopilamos información personal que usted nos proporciona voluntariamente al registrarse, solicitar nuestros servicios o comunicarse con nosotros. Esta información puede incluir:",
            "• Nombre completo y datos de identificación",
            "• Información de contacto (correo electrónico, teléfono, dirección)",
            "• Información financiera necesaria para la prestación de servicios",
            "• Historial de transacciones y servicios contratados"
          ],
          en: [
            "At CROMU, we collect personal information that you voluntarily provide to us when you register, request our services, or communicate with us. This information may include:",
            "• Full name and identification details",
            "• Contact information (email, phone, address)",
            "• Financial information necessary for service provision",
            "• Transaction history and contracted services"
          ]
        }
      },
      usage: {
        title: {
          es: "Uso de la Información",
          en: "Use of Information"
        },
        icon: FileText,
        content: {
          es: [
            "Utilizamos su información personal para los siguientes fines:",
            "• Proporcionar y mantener nuestros servicios financieros",
            "• Procesar transacciones y solicitudes",
            "• Comunicarnos con usted sobre su cuenta o servicios",
            "• Mejorar nuestros servicios y experiencia del usuario",
            "• Cumplir con obligaciones legales y regulatorias"
          ],
          en: [
            "We use your personal information for the following purposes:",
            "• Provide and maintain our financial services",
            "• Process transactions and requests",
            "• Communicate with you about your account or services",
            "• Improve our services and user experience",
            "• Comply with legal and regulatory obligations"
          ]
        }
      },
      protection: {
        title: {
          es: "Protección de Datos",
          en: "Data Protection"
        },
        icon: Shield,
        content: {
          es: [
            "Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra accesos no autorizados, alteración, divulgación o destrucción. Estas medidas incluyen:",
            "• Cifrado de datos sensibles",
            "• Control de acceso restringido",
            "• Monitoreo regular de nuestros sistemas",
            "• Capacitación del personal en protección de datos"
          ],
          en: [
            "We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
            "• Encryption of sensitive data",
            "• Restricted access control",
            "• Regular system monitoring",
            "• Staff training on data protection"
          ]
        }
      },
      sharing: {
        title: {
          es: "Compartir Información",
          en: "Information Sharing"
        },
        icon: Share2,
        content: {
          es: [
            "No vendemos ni alquilamos su información personal a terceros. Solo compartimos su información cuando sea necesario para:",
            "• Cumplir con requerimientos legales",
            "• Proteger nuestros derechos legales",
            "• Procesar pagos a través de proveedores de servicios de pago",
            "• Colaborar con autoridades competentes en investigaciones"
          ],
          en: [
            "We do not sell or rent your personal information to third parties. We only share your information when necessary to:",
            "• Comply with legal requirements",
            "• Protect our legal rights",
            "• Process payments through payment service providers",
            "• Collaborate with competent authorities in investigations"
          ]
        }
      },
      rights: {
        title: {
          es: "Sus Derechos",
          en: "Your Rights"
        },
        icon: Users,
        content: {
          es: [
            "Usted tiene derecho a:",
            "• Acceder a sus datos personales",
            "• Solicitar la corrección de datos inexactos",
            "• Solicitar la eliminación de sus datos personales",
            "• Oponerse al procesamiento de sus datos",
            "• Solicitar la portabilidad de sus datos",
            "\nPara ejercer estos derechos, puede contactarnos a través de los canales indicados en la sección de Contacto."
          ],
          en: [
            "You have the right to:",
            "• Access your personal data",
            "• Request correction of inaccurate data",
            "• Request deletion of your personal data",
            "• Object to the processing of your data",
            "• Request data portability",
            "\nTo exercise these rights, you can contact us through the channels indicated in the Contact section."
          ]
        }
      },
      changes: {
        title: {
          es: "Cambios en la Política de Privacidad",
          en: "Changes to the Privacy Policy"
        },
        icon: Lock,
        content: {
          es: "Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web y actualizando la fecha de \"Última actualización\" en la parte superior de este documento.",
          en: "We reserve the right to update this privacy policy at any time. We will notify you of significant changes by posting the new policy on our website and updating the \"Last updated\" date at the top of this document."
        }
      },
      contact: {
        title: {
          es: "Contacto",
          en: "Contact"
        },
        icon: Mail,
        content: {
          es: "Si tiene preguntas sobre esta política de privacidad o el manejo de sus datos personales, puede contactarnos en:",
          en: "If you have questions about this privacy policy or the handling of your personal data, you can contact us at:"
        },
        email: "atencionclientecromu@gmail.com",
        phone: "+57 314 2556085",
        phone2: "+57 310 2223491"
      }
    }
  }

  // Función para renderizar el contenido
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <motion.p 
          key={index} 
          className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {item}
        </motion.p>
      ))
    }
    return (
      <motion.p 
        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {content}
      </motion.p>
    )
  }

  // Efecto para manejar el scroll suave a las secciones
  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  if (!mounted) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Hero Section con paralaje */}
      <section className="relative py-12 bg-gradient-to-r from-[#1a5c41] via-[#2a7d5a] to-[#1a5c41] overflow-hidden">
        {/* Watermark animado */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
          <motion.h1 
            className="text-white text-8xl md:text-9xl font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ y }}
          >
            {translations.watermark[language as keyof typeof translations.watermark]}
          </motion.h1>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block relative mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Shield className="w-16 h-16 text-white/90 mx-auto mb-4" />
            </motion.div>
            
            <motion.h1 
              className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {translations.title[language as keyof typeof translations.title]}
            </motion.h1>
            
            <motion.h2
              className="text-white/90 text-xl md:text-2xl font-medium mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {translations.subtitle[language as keyof typeof translations.subtitle]}
            </motion.h2>
            
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {translations.lastUpdated[language as keyof typeof translations.lastUpdated]}
            </motion.p>
            
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-white text-sm font-medium">
                  {translations.tagline[language as keyof typeof translations.tagline]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-500"></div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar con navegación */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
            >
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-[#1a5c41] dark:text-emerald-400 text-lg font-bold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {language === 'es' ? 'Índice' : 'Index'}
                  </h3>
                  <nav className="space-y-2">
                    {Object.entries(translations.sections).map(([key, section], index) => {
                      const Icon = section.icon
                      return (
                        <motion.a
                          key={key}
                          href={`#${key}`}
                          className="flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#2a7d5a]/10 hover:text-[#1a5c41] dark:hover:text-emerald-400 transition-all duration-300 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ x: 5 }}
                        >
                          <Icon className="w-4 h-4 mr-3 text-[#2a7d5a] group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-sm font-medium">
                            {section.title[language as keyof typeof section.title]}
                          </span>
                        </motion.a>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* Contenido principal */}
            <motion.div 
              className="lg:col-span-9"
             
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {Object.entries(translations.sections).map(([key, section], index) => {
                  const Icon = section.icon
                  return (
                    <motion.section 
                      key={key} 
                      id={key}
                      className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-700 last:border-b-0 scroll-mt-20"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.div 
                        className="flex items-center mb-6"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a7d5a] to-[#1a5c41] flex items-center justify-center mr-4 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            {section.title[language as keyof typeof section.title]}
                          </h2>
                          <motion.div
                            className="h-1 bg-gradient-to-r from-[#2a7d5a] to-[#1a5c41] rounded-full mt-2"
                            initial={{ width: 0 }}
                            whileInView={{ width: "60px" }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="ml-16 space-y-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {renderContent(section.content[language as keyof typeof section.content])}
                        
                        {key === 'contact' && (
                          <motion.div 
                            className="mt-8 p-6 bg-gradient-to-br from-[#2a7d5a]/5 to-[#1a5c41]/5 rounded-xl border border-[#2a7d5a]/20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            viewport={{ once: true }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div 
                                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Mail className="w-5 h-5 text-[#2a7d5a] mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                  <a 
                                    href={`mailto:${(section as any).email}`}
                                    className="text-[#1a5c41] hover:text-[#2a7d5a] dark:text-emerald-400 font-medium transition-colors duration-300"
                                  >
                                    {(section as any).email}
                                  </a>
                                </div>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Phone className="w-5 h-5 text-[#2a7d5a] mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                                  <p className="text-gray-800 dark:text-gray-300 font-medium">
                                    {(section as any).phone} | {(section as any).phone2}
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.section>
                  )
                })}
                
                {/* Footer de la política */}
                <motion.div 
                  className="bg-gradient-to-r from-[#1a5c41] to-[#2a7d5a] p-8 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Shield className="w-12 h-12 text-white/90 mx-auto mb-4" />
                    <p className="text-white text-lg font-medium mb-2">
                      © {new Date().getFullYear()} CROMU
                    </p>
                    <p className="text-white/80">
                      {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}